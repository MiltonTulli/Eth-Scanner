import fs from "fs";
import path from "path";
import { Command } from "commander";
import { run } from "./src/run";

const program = new Command();

program
  .option("-f, --filePath <string>", "File Name to save success output", "")
  .option("-ba, --batchAmount <number>", "Batch Amount to fetch balances", "5");

program.parse();

const options = program.opts();
const filePath = options.filePath;

if (filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

const config = { batchAmount: Number(options.batchAmount), filePath };
run(config);
