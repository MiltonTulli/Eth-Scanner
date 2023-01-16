const fs = require("fs");
const bip39 = require("bip39");
// import ora from "ora";
// const { checkBalance } = require("./getBalance");
const { generateCombinations } = require("./getCombinations");
const { getKeys } = require("./getKeys");
const { getMultipleBalances, hasBalance } = require("./scrapBalance");

const DEFAULT_BIP_INDEX = 0;
const wordList = bip39.wordlists.english;

const run = async function (config) {
  const { batchAmount, bipIndex } = config;

  const BIP_INDEX = Number(bipIndex || DEFAULT_BIP_INDEX);
  const START_WORD = wordList[BIP_INDEX];
  const fileName = `./combinations/${START_WORD}.json`;
  const BATCH_AMOUNT = batchAmount || 5;

  console.log("\n********************");
  console.log("BIP_INDEX: ", BIP_INDEX);
  console.log("START_WORD: ", START_WORD);
  console.log("BATCH_AMOUNT: ", BATCH_AMOUNT);
  console.log("********************\n");

  //   const spinner = ora("Loading unicorns").start();
  //   spinner.text = "Loading rainbows";

  let lastMnemonic;
  try {
    lastMnemonic = JSON.parse(fs.readFileSync(fileName))?.lastMnemonic;
    console.log("LastMnemonic found");
  } catch (e) {
    fs.writeFileSync(fileName, JSON.stringify({}));
    console.log("LastMnemonic not found");
  }

  const iterator = generateCombinations(wordList, 12, BIP_INDEX, lastMnemonic);
  let index = 0;
  let batch = [];
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }

    const mnemonic = value.join(" ");
    const { address, privateKey } = getKeys(mnemonic);

    const struct = { mnemonic: mnemonic, address, privateKey: privateKey };
    batch.push(struct);
    if (batch.length === BATCH_AMOUNT || done) {
      const addresses = batch.map((b) => b.address);
      console.log("Getting batch balance");
      const balances = await getMultipleBalances(addresses);
      batch.forEach((_struct, i) => {
        const balance = balances[i];
        const rawData = JSON.parse(fs.readFileSync(fileName));
        rawData.lastMnemonic = _struct.mnemonic;
        if (!hasBalance(balance)) {
          console.log(`${_struct.mnemonic} |  NO BALANCE --`);
        } else {
          console.log("Found Balance!");
          _struct.balance = balance;
          const matches = [...(rawData.matches || []), _struct];
          rawData.matches = matches;
        }
        fs.writeFileSync(fileName, JSON.stringify(rawData));
        index++;
      });
      batch = [];
    }
  }
};

module.exports = { run };
