import Web3 from "web3";
export const weiToEth = (amount: string) =>
  Web3.utils.fromWei(String(amount), "ether");
