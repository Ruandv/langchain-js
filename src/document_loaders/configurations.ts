import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from "langchain/llms/openai"
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import path from "path";
import { PromptTemplate } from "langchain/prompts";

export default class Configurations {
    private _root: string;

    constructor(root: string) {
        this._root = root;
        this.documentPath = path.join(this._root, '\\document_loaders\\example_data\\');
    }
    verbosity = true;
    model = new OpenAI({
        temperature: 0.1,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        verbose: this.verbosity
    });
    documentPath: string;
}