import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from "langchain/llms/openai"

import { RetrievalQAChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import path from "path";
import * as fs from 'fs';

export const run = async (args: any) => {
    var model = new OpenAI({ temperature: 0.1,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, 

         },);
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const documentPath = path.join(args["root"], '\\document_loaders\\example_data\\');
    let documents = [] as string[];
    await fs.readdir(path.join(args['root'], '\\document_loaders'), (x, f) => {
        documents = f;
    });
    
    var loader = new PDFLoader(path.join(documentPath, "RachelGreenCV.pdf"), { splitPages: true });
    var docs = await loader.loadAndSplit(textSplitter);
    
    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, 

        }));
        
    // Initialize a retriever wrapper around the vector store
    const vectorStoreRetriever = vectorStore.asRetriever();

    // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
    const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever,{ verbose: true});
    const res = await chain.call({
        query: args["question"],
    });
    console.log({ res });
}