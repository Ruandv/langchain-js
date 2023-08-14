import { OpenAI } from "langchain/llms/openai";

export const run = async () => {
  // temperature controls how random/creative the response is. It ranges from 0(deterministic) to 1(max creativity)
  const model = new OpenAI({ temperature: 0.1,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, });

  const res = await model.call("What is the capital city of France?");
  console.log({ res });
  //output: "Paris"
};
