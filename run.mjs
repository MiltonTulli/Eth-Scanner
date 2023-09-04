import fs from "fs";
import bip39 from "bip39";
import ora from "ora";
import { generateCombinations } from "./getCombinations.mjs";
import { getKeys } from "./getKeys.mjs";
import { getMultipleBalances, hasBalance } from "./scrapBalance.mjs";
import { pushToFirebase } from "./firebase.mjs";

const wordList = bip39.wordlists.english;

export const run = async function (config) {
  const { batchAmount } = config;

  const fileName = `./combinations/matches.json`;
  const BATCH_AMOUNT = batchAmount || 5;
  const CI = false;

  const spinner = ora({
    discardStdin: false,
    text: "Starting ",
  }).start();

  spinner.text = "Starting ";


  const iterator = generateCombinations(wordList);
  let batch = [];
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
      spinner.text = "Getting balances";
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
            try{
              const rawData = JSON.parse(fs.readFileSync(fileName));
              const matches = [...(rawData.matches || []), _struct];
              rawData.matches = matches;
              fs.writeFileSync(fileName, JSON.stringify(rawData));
            } catch(e){
              console.log("error saving into combinations", e );
            }
          pushToFirebase(_struct);
        }
      });
      batch = [];
    }
  }
};
