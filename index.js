require("dotenv").config();
const { program } = require("commander");
const { run } = require("./run");

program.option("--index <type>");
program.parse();

const options = program.opts();
const index = options.index;

const config = { bipIndex: index };
run(config);
