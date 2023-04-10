import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pay", function () {
  it("Should create contacts", async () => {
    const payContractFactory = await ethers.getContractFactory("Pay");
    const payContract = await payContractFactory.deploy();
    await payContract.deployed();

    const tmp = await payContract.getContacts();
    console.log("here ===> ", tmp);

    const accountsList: any[] = await ethers.getSigners();
    const newContact = accountsList[3];
    const expectedFullName = `Next account - [${newContact.address}]`;
    const expectedWalledAddress = newContact.address;
    await payContract.addContact(expectedFullName, expectedWalledAddress);
    const contacts = await payContract["getContacts()"]();
    expect(contacts[0].full_name).to.equal(expectedFullName);
    expect(contacts[0].wallet_address).to.equal(expectedWalledAddress);
  });
});
/* 
contract("PayContract", (accounts_addresses = []) => {
  it("Should be able to add another account as a contact", async () => {
    const first_account = accounts_addresses[0];
    const second_account = ac counts_addresses[1];
    const pay_contract = await PayContract.deployed();

    await pay_contract.addContact.call(
      `Second account - [${second_account}]`,
      second_account,
      { from: first_account }
    );
    let accounts = {};
    for (let i in accounts_addresses) {
      address = accounts_addresses[i];
      accounts[+i] = {
        address,
        contacts: await pay_contract.getContacts.call({
          from: address,
        }),
        balance: (
          await pay_contract.getBalance.call({
            from: address,
          })
        ).toString(),
      };
    }

    console.log("HERE ====> ", {
      accounts,
      tmmp: accounts[1]["contacts"],
    });
  });
  it("Checking pay contract transfer", async () => {
    return;

    for (let i in accounts_addresses.slice(0, 2)) {
      const address = accounts_addresses[i];
      const balance_bignum = await pay_contract.getBalance.call({
        from: address,
      });
      const balance = balance_bignum.toString();
      accounts[i] = {
        address,
        balance,
      };
      const prev_i = i - 1;
      if (!!accounts[prev_i]) {
        await pay_contract.addContact.call(`Account index ${i}`, address, {
          from: accounts[prev_i]["address"],
        });
        const contacts = await pay_contract.getContacts.call({
          from: accounts[prev_i]["address"],
        });
        const contactsOne = await pay_contract.getContacts.call(
          "0xD603F3A9DAbE385C9c8ce0dE1A97e096c9c6be4b"
        );
        const contactsTwo = await pay_contract.getContacts.call(
          "0x4A139a1A907dC0ffc0429083baB7F25a7B5BF50B"
        );
        console.log("HERE ====> ", {
          accounts,
          add: accounts[prev_i]["address"],
          contacts,
          contactsOne,
          contactsTwo,
        });
        return;
        const source_previous_balance = +accounts[prev_i]["balance"];
        const ammount_to_transfer = source_previous_balance * 0.15;
        const target_previous_balance = +accounts[i]["balance"];
        const source_expected_balance =
          +accounts[prev_i]["balance"] - ammount_to_transfer;
        const target_expected_balance =
          +accounts[i]["balance"] + ammount_to_transfer;
        await pay_contract.payEthToContact.call(0);

        assert.equal(
          accounts[i - 1]["balance"],
          accounts[i]["balance"],
          `Addresses with index ${i} and ${i - 1} have same balance`
        );
      }
    }
  });
});
 */
