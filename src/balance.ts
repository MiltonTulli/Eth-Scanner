import { publicClient } from "./viem-client.js";
import { formatEther, erc20Abi, type Address } from "viem";

const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const hasBalance = (balance) => {
  const ZERO_VALUES = ["0 Ether", undefined, null, "", "0"];
  return balance && !ZERO_VALUES.includes(balance);
};

export const getBalances = async (address: Address) => {
  // Native balance | ETH
  const balances = await Promise.all([
    publicClient.getBalance({
      address,
    }),
    // USDT Balance
    publicClient.readContract({
      address: USDT_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    }),
    // DAI Balance
    publicClient.readContract({
      address: DAI_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    }),
  ]);

  // Return first that balance is not zero
  return balances.find((b) => hasBalance(formatEther(b))) ?? balances[0];
};

export const getMultipleBalances = async (addresses: Address[]) => {
  const _values = await Promise.all(addresses.map(getBalances));
  return _values.map((balance) => formatEther(balance));
};
