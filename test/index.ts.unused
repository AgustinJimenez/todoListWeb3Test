import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
  it("Should manage account contacts", async () => {
    const accounts: Array<SignerWithAddress & { balance?: any }> =
      await ethers.getSigners();
    const Pay = await ethers.getContractFactory("Pay");
    const payContract = await Pay.deploy();
    await payContract.deployed();
    // contacts list
    let contacts_list: any = [];
    contacts_list = await payContract["getContacts()"]();
    expect(contacts_list?.length).to.equal(0);
    for (let friend_account of accounts) {
      contacts_list = await payContract["getContacts(address)"](
        friend_account.address
      );
      expect(contacts_list?.length).to.equal(0);
    }

    // add contacts

    for (let key in accounts) {
      if (+key === 0) continue;
      const friend_account = accounts[key];
      const friend_name = `Friend ${key}`;
      await payContract.addContact(friend_name, friend_account["address"]);
      contacts_list = await payContract["getContacts()"]();
      const friend_contact = contacts_list[+key - 1];
      expect(contacts_list?.length).to.equal(+key);
      expect(friend_contact["full_name"]).to.equal(friend_name);
      expect(friend_contact["wallet_address"]).to.equal(
        friend_account["address"]
      );
    }
    const contacts_list_balance = [];
    for (let key in contacts_list) {
      let contact = contacts_list[key];
      contact = {
        balance: await payContract["getContacts(address)"](
          contact.wallet_address
        ),
        address: contact.wallet_address,
        full_name: contact.full_name,
      };
      contacts_list_balance.push(contact);
      console.log("FIRST ===> ", contacts_list_balance);
    }
  });
});
