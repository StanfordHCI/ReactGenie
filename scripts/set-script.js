#!/usr/bin/env node

const fs = require("fs");
const folderName = "./__test__";

if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

console.log("Test folder created");

const dry_run_test = `
import {DslInterpreter, DescriptorPromptGen} from "reactgenie-dsl";
import {initReactGenie, AllGenieObjects} from "reactgenie-lib";
import * as fs from 'fs';
require('../genie/Timer')

const reactGenieStore = initReactGenie();
let descriptors = []
for (const key in AllGenieObjects) {
    descriptors.push(AllGenieObjects[key].ClassDescriptor)
    // console.log(key)
}

const cmd = fs.readFileSync('./__test__/dry-run-input.txt', 'utf8');
console.log(cmd);
const interpreter = new DslInterpreter(descriptors, true);

try {
    let funcCallResult = interpreter.interpret(cmd);
    // print ok or success
    fs.writeFileSync('./__test__/dry-run-result.txt', "Success");
}
catch (e) {
    fs.writeFileSync('./__test__/dry-run-result.txt', e.toString());
}
test("test", () => {});
    `;

fs.writeFile("./__test__/dry-run.test.ts", dry_run_test, function (err) {
  if (err) throw err;
  console.log("Created dry-run test!");
});
fs.writeFile("./__test__/dry-run-input.txt", "", function (err) {
  if (err) throw err;
  console.log("Created dry-run input!");
});

fs.writeFile("./__test__/dry-run-result.txt", "", function (err) {
  if (err) throw err;
  console.log("Created dry-run output!");
});

const prompt_test =
  'import {DslInterpreter, GenieObject} from "reactgenie-dsl";\n' +
  'import {ClassDescriptor, DateTime, TimeDelta} from "reactgenie-lib";\n' +
  'import {initReactGenie} from "reactgenie-lib";\n' +
  'import {AllGenieObjects} from "reactgenie-dsl";\n' +
  'import {DescriptorPromptGen, sharedState} from "reactgenie-dsl";\n' +
  'import fs from "fs";\n' +
  "require('../genie/Timer')\n" +
  "\n" +
  "const reactGenieStore = initReactGenie();\n" +
  "\n" +
  "    let descriptors:ClassDescriptor<GenieObject>[] = []\n" +
  "    for (const key in AllGenieObjects) {\n" +
  "        descriptors.push(AllGenieObjects[key].ClassDescriptor)\n" +
  "        // console.log(key)\n" +
  "    }\n" +
  "\n" +
  "\n" +
  "    // @ts-ignore\n" +
  '    const nl_interpreter = new DescriptorPromptGen(descriptors,sharedState["__EXAMPLES__"])\n' +
  "    const prompt_basic = nl_interpreter.prompt_basic()\n" +
  "    fs.writeFileSync('./__test__/prompt.txt', prompt_basic);\n" +
  "\n" +
  'test("test", () => {});\n';

fs.writeFile("./__test__/prompt.test.ts", prompt_test, function (err) {
  if (err) throw err;
  console.log("Created prompt test!");
});
fs.writeFile("./__test__/prompt.txt", "", function (err) {
  if (err) throw err;
  console.log("Created prompt output!");
});

const jest_config =
  "module.exports = {\n" +
  '    testEnvironment: "jsdom",\n' +
  '        preset: "jest-expo",\n' +
  '        "moduleNameMapper": {\n' +
  '        "\\\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",\n' +
  '            "\\\\.(css|less)$": "<rootDir>/mocks/fileMock.js",\n' +
  "            \"^uuid$\": require.resolve('uuid'),\n" +
  "    }\n" +
  "}";

fs.writeFile("./jest.config.js", jest_config, function (err) {
  if (err) throw err;
  console.log("Created jest config!");
});

const mocksName = "./mocks";

if (!fs.existsSync(mocksName)) {
  fs.mkdirSync(mocksName);
}

const mock_config = "module.exports = '';";

fs.writeFile("./mocks/fileMock.js", mock_config, function (err) {
  if (err) throw err;
  console.log("Created mock config!");
});
