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
import { get } from "http";

test("test",  async () => {
// list all files in "../genie" folder
const files = fs.readdirSync("./genie");
// get only ts files
const tsFiles = files.filter((file) => file.endsWith(".ts"));
// require all ts files
tsFiles.forEach((file) => {
  require("../genie/" + file);
});

//set descriptor
const reactGenieStore = initReactGenie();
let descriptors = []
for (const key in AllGenieObjects) {
    descriptors.push(AllGenieObjects[key].ClassDescriptor)
    // console.log(key)
}
const interpreter = new DslInterpreter(descriptors, true);

//get all commands
const cmd = fs.readFileSync('./__test__/dry-run-input.txt', 'utf8');
// split by new line
const cmdList = cmd.split("\\n");
console.log(cmdList);

let output = "";
for (let i = 0; i < cmdList.length; i++) {
    const cmd = cmdList[i];
    try {
        let funcCallResult = await interpreter.interpret(cmd);
        console.log(funcCallResult);
        output += JSON.stringify({status: 'success', result: funcCallResult}) + "\\n";
        // print ok or success
    }
    catch (e) {
        output += JSON.stringify({status: 'error', result: e}) + "\\n";
    }
}

fs.writeFileSync('./__test__/dry-run-output.txt', output);
}); 
    `;

fs.writeFile("./__test__/dry-run.test.ts", dry_run_test, function (err) {
  if (err) throw err;
  console.log("Created dry-run test!");
});
fs.writeFile("./__test__/dry-run-input.txt", "", function (err) {
  if (err) throw err;
  console.log("Created dry-run input!");
});

fs.writeFile("./__test__/dry-run-output.txt", "", function (err) {
  if (err) throw err;
  console.log("Created dry-run output!");
});

// fs.writeFile("./__test__/dry-run-error.txt", "", function (err) {
//   if (err) throw err;
//   console.log("Created dry-run error!");
// });

const prompt_test = `
  import {DslInterpreter, GenieObject} from "reactgenie-dsl";
  import {ClassDescriptor, DateTime, TimeDelta} from "reactgenie-lib";
  import {initReactGenie} from "reactgenie-lib";
  import {AllGenieObjects} from "reactgenie-dsl";
  import {DescriptorPromptGen, sharedState} from "reactgenie-dsl";
  import fs from "fs";
  
  test("test", () => {
  const files = fs.readdirSync("./genie");
  // get only ts files
  const tsFiles = files.filter((file) => file.endsWith(".ts"));
  // require all ts files
  tsFiles.forEach((file) => {
      require("../genie/" + file);
  });
  
  const reactGenieStore = initReactGenie();
  
      let descriptors:ClassDescriptor<GenieObject>[] = []
      for (const key in AllGenieObjects) {
          descriptors.push(AllGenieObjects[key].ClassDescriptor)
          // console.log(key)
      }
  
  
      // @ts-ignore
      const nl_interpreter = new DescriptorPromptGen(descriptors,sharedState["__EXAMPLES__"])
      const prompt_basic = nl_interpreter.prompt_basic()
      fs.writeFileSync('./__test__/prompt.txt', prompt_basic);
  
  });
`;

fs.writeFile("./__test__/prompt.test.ts", prompt_test, function (err) {
  if (err) throw err;
  console.log("Created prompt test!");
});
fs.writeFile("./__test__/prompt.txt", "", function (err) {
  if (err) throw err;
  console.log("Created prompt output!");
});

const parse_test = `
import {NlParser, DescriptorPromptGen, ClassDescriptor, GenieObject, sharedState} from "reactgenie-dsl";
import {initReactGenie, AllGenieObjects} from "reactgenie-lib";
import * as fs from 'fs';
let API_KEY = ""

test("test",   async () => {
    const files = fs.readdirSync("./genie");
    const tsFiles = files.filter((file) => file.endsWith(".ts"));
    tsFiles.forEach((file) => {
        require("../genie/" + file);
    });
    const reactGenieStore = initReactGenie();

    let descriptors:ClassDescriptor<GenieObject>[] = []
    for (const key in AllGenieObjects) {
        descriptors.push(AllGenieObjects[key].ClassDescriptor)
    }


    const testPath = process.argv;
    const nl_interpreter = new DescriptorPromptGen(descriptors,sharedState["__EXAMPLES__"])

    let NLP = new NlParser(nl_interpreter, API_KEY,"http://104.40.11.234:5000/v1");
    // console.log(testPath);
    let res = await NLP.parse(process.argv[3])
    console.log(res)

    // console.log(testPath[3]);
}, 100000);
    
`;

fs.writeFile("./__test__/parse.test.ts", parse_test, function (err) {
  if (err) throw err;
  console.log("Created parse test!");
});



const jest_config = `
module.exports = {
  testEnvironment: "jsdom",
      preset: "jest-expo",
      "moduleNameMapper": {
      "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
          "\\.(css|less)$": "<rootDir>/mocks/fileMock.js",
          "^uuid$": require.resolve('uuid'),
  },
  testEnvironmentOptions: {
      url: 'http://104.40.11.234:5000/v1',
      verbose: true,
  },
}
  `;

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
