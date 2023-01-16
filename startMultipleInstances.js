/**
 *
 * This script creates 2048 instances. Be careful
 *
 *
 */
const bip39 = require("bip39");
const wordListLength = bip39.wordlists.english.length;
const pm2 = require("pm2");

const indexes = Array.from({ length: wordListLength }, (_, i) => i);

pm2.connect(() => {
  indexes.forEach((index) => {
    pm2.start(
      {
        name: `run.js-${index}`, // give each process a unique name
        script: "run.js",
        env: {
          BIP_INDEX: index,
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(2);
        }
      }
    );
  });
});
