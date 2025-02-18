import fs from "fs";
import ora from "ora";
import { generateCombinations, getKeys } from "./mnemonic.js";
import { getMultipleBalances, hasBalance } from "./balance.js";
import { type Address } from "viem";

interface Struct {
  mnemonic: string;
  address: Address;
  privateKey: Address;
  balance?: string;
}

interface Config {
  filePath?: string;
  batchAmount: number;
}
export const run = async function (config: Config) {
  const { batchAmount, filePath } = config;

  const BATCH_AMOUNT = batchAmount || 5;

  const spinner = ora({
    discardStdin: false,
    text: "Starting ",
  }).start();

  spinner.text = "Starting ";

  const iterator = generateCombinations();
  let batch: Struct[] = [];
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }

    let mnemonic = value;

    const { address, privateKey } = getKeys(mnemonic);

    const struct = { mnemonic: mnemonic, address, privateKey: privateKey };
    batch.push(struct);
    if (batch.length === BATCH_AMOUNT || done) {
      const addresses = batch.map((b) => b.address);
      spinner.text = "Getting balances\n";
      const balances = await getMultipleBalances(addresses);
      batch.map((_struct, i) => {
        const balance = balances[i];
        _struct.balance = balance;
        if (!hasBalance(balance)) {
          spinner.fail(`${_struct.address} |  NO BALANCE | ${balance}`).start();
        } else {
          spinner
            .succeed(
              `Found Balance! ${balance} MNEMONIC=${_struct.mnemonic} address=${_struct.address}`
            )
            .start();
          if (filePath) {
            try {
              const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
              const matches = [...(rawData.matches || []), _struct];
              rawData.matches = matches;
              fs.writeFileSync(filePath, JSON.stringify(rawData));
            } catch (e) {
              console.log("error saving into combinations", e);
            }
          }
        }
      });
      batch = [];
    }
  }
};
