import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//process.argv returns an array containing command line arguments
// exampleName is the file path of the example we want to `run`
const [exampleName, ...args] = process.argv.slice(2);
try {
  const modulePath = path.join(__dirname, exampleName);
  const { run: runExample } = await import(`file://${modulePath}`);
  const ar = {
    root: __dirname,
    question: args[1],
    loaderType: args[0]
  };
  runExample(ar);
} catch (e) {
  console.error(e);
  throw new Error(`Could not load example ${exampleName}`);
}
