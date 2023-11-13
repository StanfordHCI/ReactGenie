#!/usr/bin/env node

const args = process.argv.slice(2);
console.log("Input Command:\n", args);

// let fs = require("fs");
// fs.writeFileSync("./__test__/dry-run-input.txt", args[0]);

const { spawn } = require("child_process");
let command = "npx";

// Check if the operating system is Windows
if (process.platform === "win32") {
  command = "npx.cmd";
}
const childProcess = spawn(command, ["jest", "./__test__/parse.test.ts", args[0]]);
console.log("Running Test ... ");
childProcess.stdout.pipe(process.stdout);



// console.log("Running Test ... ");
// childProcess.on("close", function(code, signal) {
//     const result = fs.readFileSync("./__test__/dry-run-result.txt", "utf8");
//     console.log("Result:\n", result);
// });
