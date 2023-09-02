#!/usr/bin/env node

const args = process.argv.slice(2);
// console.log("Input Command:\n", args);

let fs = require("fs");
fs.writeFileSync("./__test__/dry-run-input.txt", args[0]);

const { spawn } = require("child_process");
const childProcess = spawn("jest", ["./__test__/dry-run.test.ts", ...args]);
// console.log("Running Test ... ");
childProcess.on("exit", function (code, signal) {
  const result = fs.readFileSync("./__test__/dry-run-result.txt", "utf8");
  console.log(result);
});
