#!/usr/bin/env node

const { spawn } = require("child_process");

let command = "npx";

// Check if the operating system is Windows
if (process.platform === "win32") {
  command = "npx.cmd";
}

const childProcess = spawn(command, ["jest", "./__test__/prompt.test.ts"]);
console.log("Generating Prompt ... ");

let fs = require("fs");
childProcess.on("exit", function (code, signal) {
  const result = fs.readFileSync("./__test__/prompt.txt", "utf8");
  console.log("Prompt:\n", result);
});
