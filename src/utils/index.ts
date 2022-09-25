export const weiToEth = (amount: string) => {
  const value = +window.web3.utils.fromWei(String(amount), "ether");
  return value;
};
