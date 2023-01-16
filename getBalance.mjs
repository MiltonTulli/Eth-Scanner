import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY
  )
);

export async function checkBalance(addresses) {
  const balancePromises = addresses.map((address) => {
    return web3.eth.getBalance(address);
  });
  const balances = await Promise.all(balancePromises);
  return balances;
}
