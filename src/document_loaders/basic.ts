import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { PDFLoader, TextLoader } from "langchain/document_loaders";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import path from "path";
import Configurations from "./configurations.js";

//loads data from text files 

export const run = async (args: any) => {
  const config = new Configurations(args["root"]);

  const library = [{
    fileType: 'txt', loader: new TextLoader(
      path.join(config.documentPath, "txt", "state_of_the_union.txt")
    )
  },
  { fileType: 'pdf', loader: new PDFLoader(path.join(config.documentPath, "pdf", "RachelGreenCV.pdf"), { splitPages: true }) }]


  //https://js.langchain.com/docs/modules/chains/popular/vector_db_qa/
  const promptTemplate = `Use the following pieces of context to answer the question at the end. 
                            If you don't know the answer, just say that you don't know,and tel a bad dad joke.
                            {context}
                            Question: {question}
                            Answer in Afrikaans:`;
  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  
  

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

  const loader = library.find(x => x.fileType === args["loaderType"])?.loader;
  var docs = await loader!.loadAndSplit(textSplitter);

  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIBasePath: process.env.AZURE_OPENAI_ENDPOINT,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    verbose: config.verbosity
  });
  let vectorStore: HNSWLib;
  try {
    console.log("Trying to load vectorstore")
    vectorStore = await HNSWLib.load(path.join(config.documentPath, "txt", 'vectors'), embeddings);
  }
  catch {
    // // Create a vector store from the documents.
    console.log("Creating vector store")
    vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    console.log("Saving vector store to file")
    vectorStore.save(path.join(config.documentPath, "txt", 'vectors'))
  }
  console.log("Vectorstore loaded")

  // Initialize a retriever wrapper around the vector store
  const vectorStoreRetriever = vectorStore.asRetriever();

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(config.model, { prompt }),
    retriever: vectorStoreRetriever,
  });
  const res = await chain.call({
    query: args["question"],
  });

  console.log("DONE:", res["text"]);
}