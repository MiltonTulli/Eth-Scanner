import pm2 from "pm2";

const processes = 3;
const indexes = Array.from({ length: processes }, (_, i) => i);

console.log("RUNNING ALL INSTANCES");
pm2.connect(() => {
  indexes.forEach((index) => {
    pm2.start(
      {
        name: `index.ts-${index.toString()}`, // give each process a unique name
        script: `index.ts`,
        env: {
          BIP_INDEX: index.toString(),
        },
      } as pm2.StartOptions,
      (err) => {
        if (err) {
          console.error(err);
          process.exit(2);
        }
      }
    );
  });
});
