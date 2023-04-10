export const weiToEth = (amount: string, web3Instance: any) => {
  const value = +web3Instance.utils.fromWei(String(amount), "ether");
  return value;
};
