import { PromptTemplate } from "langchain/prompts";
/**
 * In reality, you would get a user's input and then add it to your prompt
 * before sending it to the large language model.
 */
export const run = async () => {
  const template = "List all the municipalies for {province}?";
  const prompt = new PromptTemplate({
    inputVariables: ["province"],
    template: template, // your template without external input
  });

  const res = await prompt.format({
    province: "Gauteng",
  });
  console.log(res);
  // output: "What is the capital city of France?"
};
