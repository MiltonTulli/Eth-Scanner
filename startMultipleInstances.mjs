/**
 *
 * This script creates 2048 instances. Be careful
 *
 *
 */
import bip39 from "bip39";
import pm2 from "pm2";

const wordListLength = bip39.wordlists.english.length;
const indexes = Array.from({ length: wordListLength }, (_, i) => i);

pm2.connect(() => {
  indexes.forEach((index) => {
    pm2.start(
      {
        name: `index.mjs-${index}`, // give each process a unique name
        script: `index.mjs`,
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
