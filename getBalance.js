const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/c0aac05902174c0c8055f3ae6cc135bc"
  )
);

async function checkBalance(addresses) {
  const balancePromises = addresses.map((address) => {
    return web3.eth.getBalance(address);
  });
  const balances = await Promise.all(balancePromises);
  return balances;
}

module.exports = {
  checkBalance,
};

// const provider1 = 'https://www.blockchain.com/eth/address/';
// const provider2 = "https://etherchain.org/account/";
