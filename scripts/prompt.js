#!/usr/bin/env node

const { spawn } = require("child_process");
const childProcess = spawn("jest", ["./__test__/prompt.test.ts"]);
console.log("Generating Prompt ... ");

let fs = require("fs");
childProcess.on("exit", function (code, signal) {
  const result = fs.readFileSync("./__test__/prompt.txt", "utf8");
  console.log("Prompt:\n", result);
});
