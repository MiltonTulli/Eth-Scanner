import pm2 from "pm2";

const processes = 10;
const indexes = Array.from({ length: processes }, (_, i) => i);

console.log("RUNNING ALL INSTANCES");
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
