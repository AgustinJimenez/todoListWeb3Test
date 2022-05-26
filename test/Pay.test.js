// const web3 = require("web3");

const PayContract = artifacts.require("Pay");

contract("PayContract", (accounts_addresses = []) => {
  it("Checking pay contract transfer", async () => {
    const pay_contract = await PayContract.deployed();
    // let account_one_balance = await pay_contract.getBalance.call();
    // account_one_balance = account_one_balance.toString();
    await pay_contract.addContact.call(
      `Account index oooo`,
      accounts_addresses[1],
      { from: accounts_addresses[0] }
    );
    const contactsOne = await pay_contract.getContacts.call(
      accounts_addresses[0]
    );
    console.log("HERE ====> ", {
      contactsOne,
    });
    return;
    let accounts = {};
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
