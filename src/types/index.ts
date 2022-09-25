export {};
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
declare global {
  interface Window {
    web3: any;
  }
}

export interface IContact {
  full_name: string;
  wallet_address: string;
}
