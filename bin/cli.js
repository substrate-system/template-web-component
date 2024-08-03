"use strict";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { globby } from "globby";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argv = yargs(hideBin(process.argv)).scriptName("templater").usage("$0 --package-name=@namespace/name --component-name=my-webcomponent").help().argv;
const { _, ...templateParams } = argv;
const exampleFilePaths = await globby(path.resolve(__dirname, "..", "example", "*"));
const exampleFiles = await Promise.all(exampleFilePaths.map(async (filepath) => {
  return "" + await fs.readFile(filepath);
}));
exampleFiles.forEach(async (fileContent, i) => {
  const template = Handlebars.compile(fileContent);
  await fs.writeFile(exampleFilePaths[i], template(templateParams));
});
const srcFilePaths = await globby(path.resolve(__dirname, "..", "src", "*"));
const srcFiles = await Promise.all(
  srcFilePaths.map(async (filepath) => {
    return "" + await fs.readFile(filepath);
  })
);
srcFiles.forEach(async (fileContent, i) => {
  const template = Handlebars.compile(fileContent);
  await fs.writeFile(srcFilePaths[i], template(templateParams));
});
const testFilePath = path.resolve(__dirname, "..", "test", "index.ts");
const testFile = "" + await fs.readFile(testFilePath);
const testTemplate = Handlebars.compile(testFile);
await fs.writeFile(testFilePath, testTemplate(templateParams));
const packagePath = path.resolve(__dirname, "package.json");
const _package = "" + await fs.readFile(packagePath);
const packageJsonTemplate = Handlebars.compile(_package);
const packageJson = packageJsonTemplate(templateParams);
const parsed = JSON.parse(packageJson);
delete parsed.scripts["build-cli"];
await fs.writeFile(packagePath, JSON.stringify(parsed, null, 2));
await fs.rm(path.resolve(__dirname, "bin"), { recursive: true, force: true });