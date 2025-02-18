import pm2 from "pm2";

const processes = 3;
const indexes = Array.from({ length: processes }, (_, i) => i);

pm2.connect(() => {
  indexes.forEach((index) => {
    pm2.start(
      {
        name: `./dist/bundle.js-${index.toString()}`, // give each process a unique name
        script: `./dist/bundle.js`,
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
