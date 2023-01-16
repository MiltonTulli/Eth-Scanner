const HDWallet = require("ethereum-hdwallet");

var hdPathString = "m/44'/60'/0'/0";


const getKeys = (mnemonic) => {
    const hdwallet = HDWallet.fromMnemonic(mnemonic);
    const wallet = hdwallet.derive(hdPathString);
    
    const address = `0x${wallet.derive(0).getAddress().toString("hex")}`;
    const privateKey = `0x${wallet.derive(0).getPrivateKey().toString("hex")}`;

    return { address, privateKey}
}

module.exports = {
    getKeys
}