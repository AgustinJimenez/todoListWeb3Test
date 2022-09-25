import React from "react";
import Web3 from "web3";
import GreeterJSON from "../../artifacts/contracts/Greeter.sol/Greeter.json";

const NETWORK_ID = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Greeter = () => {
  const [web3, setWeb3] = React.useState<Web3 | any>();
  const [addressAccount, setAddressAccount] = React.useState("");
  const [contacts, setContacts] = React.useState([]);
  const [greetValue, setGreetValue] = React.useState("");
  const [greet, setG] = React.useState("");
  const [greeterContract, setGreeterContract] = React.useState<any>();
  const [payContract, setPayContract] = React.useState<any>();
  const fetchGreet = async () => {
    const g = await greeterContract.methods.greet().call();
    setG(g);
    setGreetValue(g);
  };
  const setGreet = async () => {
    console.log(" setGreet===> ", { greetValue, addressAccount });
    await greeterContract.methods
      .setGreeting(greetValue)
      .send({ from: addressAccount }, console.log);
    fetchGreet();
  };
  const getContacts = async () => {
    let c = [];
    console.log(
      "FIRST ===>",
      greeterContract,
      "\n",
      greeterContract?.methods,
      "\n"
    );
    try {
      c = (await greeterContract.methods.some().call()) || [];
      console.log("it works!!! ===> ", c);
    } catch (error) {
      console.log(error);
    }
    setContacts(c);
  };
  const init = async () => {
    setWeb3(new Web3(Web3.givenProvider));
  };
  const loadContracts = () => {
    setGreeterContract(new web3.eth.Contract(GreeterJSON.abi, NETWORK_ID));
    // setPayContract(new web3.eth.Contract(PayJSON.abi, NETWORK_ID));
  };
  const loadAccount = async () => {
    const accounts = await web3?.eth?.requestAccounts();
    const defaultAccount = accounts?.[0];
    if (!defaultAccount) return alert("Error: Invalid account.");

    web3.eth.defaultAccount = defaultAccount;
    setAddressAccount(defaultAccount);
  };
  React.useEffect(() => {
    if (web3) {
      loadContracts();
      loadAccount();
    }
  }, [web3]);
  React.useEffect(() => {
    init();
  }, []);
  return (
    <>
      <button onClick={fetchGreet}>FETCH GREET</button>
      <button onClick={setGreet}>SET GREET</button>
      <input
        type="text"
        value={greetValue}
        onChange={(event) => setGreetValue(event.target.value)}
      />
      <h2>{greet}</h2>

      <button onClick={getContacts}>GET CONTACTS</button>
    </>
  );
};

export default Greeter;
