import HDWallet from "ethereum-hdwallet";

const hdPathString = "m/44'/60'/0'/0";

export const getKeys = (mnemonic) => {
  const hdwallet = HDWallet.fromMnemonic(mnemonic);
  const wallet = hdwallet.derive(hdPathString);

  const address = `0x${wallet.derive(0).getAddress().toString("hex")}`;
  const privateKey = `0x${wallet.derive(0).getPrivateKey().toString("hex")}`;

  return { address, privateKey };
};
