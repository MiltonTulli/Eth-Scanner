const address = "0x8DC93c415B1894F811AFb9fe7Dfe17B24D559215";

import { getMultipleBalances, hasBalance } from "./scrapBalance.js";

const main = async () => {
  const balances = await getMultipleBalances([
    address,
    "0x199CefA72F486E4F6265DB30fF726afc6d22a0b3",
  ]);
  console.log("balance", balances);
};

main().then(() => process.exit(0));
