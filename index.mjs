import dotenv from "dotenv";
dotenv.config();

import { run } from "./run.mjs";
const index = process.env.BIP_INDEX;

const config = { bipIndex: index, batchAmount: 1 };
run(config);
