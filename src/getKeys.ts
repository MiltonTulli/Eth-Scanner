import { mnemonicToAccount } from "viem/accounts";
import { fromBytes } from "viem";

export const getKeys = (mnemonic) => {
  const acc = mnemonicToAccount(mnemonic);
  const address = acc.address;
  const buffPrivateKey = acc.getHdKey().privateKey;
  const privateKey = fromBytes(buffPrivateKey!, "hex");

  return { address, privateKey };
};
