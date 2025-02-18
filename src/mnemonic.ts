import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { fromBytes } from "viem";

export function* generateCombinations() {
  while (true) {
    yield generateMnemonic(english);
  }
}

export const getKeys = (mnemonic: string) => {
  const acc = mnemonicToAccount(mnemonic);
  const address = acc.address;
  const buffPrivateKey = acc.getHdKey().privateKey;
  const privateKey = fromBytes(buffPrivateKey!, "hex");

  return { address, privateKey };
};
