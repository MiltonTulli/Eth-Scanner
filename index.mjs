import dotenv from "dotenv";
dotenv.config();

import { run } from "./run.mjs";

const config = { batchAmount: 5 };
run(config);
