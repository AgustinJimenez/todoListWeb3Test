//@ts-nocheck
import React, { useEffect, useState } from "react";
import TodoListJSON from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import PayJSON from "../../artifacts/contracts/Pay.sol/Pay.json";
import { weiToEth } from "../utils";
import { IContact } from "../interfaces";
import Web3 from "web3";

const NETWORK_ID = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface ITask {
  id: number;
  content?: string;
  completed?: boolean;
}

interface CtxProps {
  address: string;
  setAddress: (newAddress: string) => void;
  tasks: ITask[];
  setTasks: (tasks: any) => void;
  fetchTasks: () => void;
  createTask: (content: string) => void;
  toggleCompleted: (id: string) => void;
  balance: any;
  fetchBalance: () => void;
  sendEth: (contact_id: string, amount_in_eth: number) => void;
  contacts: IContact[];
  addNewContact: ({ full_name, address }) => void;
}

const CtxDefaultValues = {
  address: "",
  setAddress: (newAddress: string) => {},
  tasks: [],
  setTasks: (tasks: ITask[]) => {},
  fetchTasks: () => {},
  createTask: (content = "") => {},
  toggleCompleted: (id) => {},
  balance: 0,
  fetchBalance: () => {},
  sendEth: (contact_id: string, amount_in_eth: number) => {},
  contacts: [],
  addNewContact: ({ full_name, address }) => {},
};

export const Web3Context = React.createContext<CtxProps>(CtxDefaultValues);

export const Web3ContextProvider = (props: any) => {
  const [web3, setWeb3] = React.useState<Web3>();
  const [contractsAreReady, setContractsAreReady] = React.useState(false);
  const [networkId, setNetworkId] = React.useState();
  const [addressAccount, setAddressAccount] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [balance, setBalance] = React.useState(0);
  const [contacts, setContacts] = React.useState<IContact[]>([]);
  const [todoContract, setTodoContract] = React.useState();
  const [payContract, setPayContract] = React.useState();

  const executeContractMethod = async (options: {
    contract: any;
    method: string;
    args: [];
    defaultValue: any;
    typeExecution: string;
    sendOptions: any;
    debug: boolean;
  }) => {
    const {
      contract,
      method,
      args = [],
      defaultValue,
      typeExecution = "call",
      sendOptions = undefined,
      debug = true,
    } = options;
    let response = defaultValue;
    try {
      //
      // if (debug)
      console.log("HERE ===> ", {
        contract,
        args,
        arguments,
        target: contract.methods[method],
      });
      response =
        (await contract.methods[method](...args)[sendOptions ? "send" : "call"](
          sendOptions
        )) || defaultValue;
      //
    } catch (error) {
      if (debug)
        console.log(
          "\n\n executeContractMethod error: ",
          { error, options },
          "\n\n"
        );
    }
    console.log("\n\n Contract method call: ", {
      contract,
      method,
      args,
      defaultValue,
      typeExecution,
      sendOptions,
      response,
    });
    return response;
  };

  const setContract = ({ abi }) => {
    return new web3.eth.Contract(abi, NETWORK_ID);
  };

  const newContactWasCreated = () => {
    fetchContacts();
  };
  const loadWeb3 = async () => {
    try {
      setWeb3(new Web3(Web3.givenProvider || "ws://localhost:8545"));
    } catch (error) {
      console.log("LOAD WEB3 ERROR: ", error);
    }
  };
  const createTask = async (content: string) => {
    await executeContractMethod({
      contract: todoContract,
      method: "createTask",
      args: [content],
      typeExecution: "send",
      sendOptions: { from: addressAccount },
    });
  };

  const toggleCompleted = async (id) => {
    await executeContractMethod({
      contract: todoContract,
      method: "toggleCompleted",
      args: [id],
      typeExecution: "send",
      sendOptions: { from: addressAccount },
    });
  };

  const fetchContacts = async () => {
    /* 
    const contacts = await executeContractMethod({
      contract: payContract,
      method: "getContacts()",
      // method: "getContacts(address)",
      // args: [addressAccount],
      defaultValue: [],
    }); 
    */
    const contacts = (await payContract.methods.getContacts().call()) || [];
    console.log("HERE ===> ", contacts);
    setContacts(contacts);
  };

  const addNewContact = async ({ full_name, address }) => {
    // await payContract.methods.addContact(full_name, address).send({ from: addressAccount });
    await executeContractMethod({
      contract: payContract,
      method: "addContact",
      args: [full_name, address],
      typeExecution: "send",
      sendOptions: { from: addressAccount },
    });
  };

  const sendEth = async (contact_id: any, amount_in_eth: number) => {
    const amount_in_wei = web3.utils.toWei(String(amount_in_eth), "ether");
    // await payContract.methods.payEthToContact(contact_id).send({ from: addressAccount, value: amount_in_wei });
    await executeContractMethod({
      contract: payContract,
      method: "payEthToContact",
      args: [contact_id],
      typeExecution: "send",
      sendOptions: { from: addressAccount, value: amount_in_wei },
    });
    fetchBalance();
  };

  const fetchDefaultAccount = async () => {
    const accounts = await web3?.eth?.requestAccounts();
    const defaultAccount = accounts?.[0];
    web3.eth.defaultAccount = defaultAccount;
    setAddressAccount(defaultAccount);
  };

  const fetchBalance = async () => {
    // let balance = await payContract.methods.getBalance().call();
    let balance = await web3.eth.getBalance(addressAccount);
    balance = weiToEth(balance).toFixed(3);
    setBalance(balance);
  };

  const fetchTasks = async () => {
    const tasksCount = await executeContractMethod({
      contract: todoContract,
      method: "tasksCount",
      args: [addressAccount],
      defaultValue: 0,
    });

    const tasks = [];
    for (let i = 0; i < +tasksCount; i++) {
      const task = await executeContractMethod({
        contract: todoContract,
        method: "tasks",
        args: [addressAccount, i],
      });
      //await todoContract.methods.tasks(addressAccount, i).call();

      tasks.push(task);
    }
    setTasks(tasks);
  };

  const setContractsEventHandlers = () => {
    payContract?.events?.NewContactWasCreated(newContactWasCreated);
  };

  const loadContracts = async () => {
    setPayContract(setContract({ abi: PayJSON.abi }));
    setTodoContract(setContract({ abi: TodoListJSON.abi }));

    //
    setContractsAreReady(true);
  };
  const bootstrap = async () => {
    await fetchDefaultAccount();
    loadContracts();
  };
  const init = async () => {
    try {
      loadWeb3();
    } catch (error) {
      console.log("INIT ERROR: ", error);
    }
  };
  //
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (web3) {
      bootstrap();
    }
  }, [web3]);
  useEffect(() => {
    if (contractsAreReady) {
      setContractsEventHandlers();
      fetchContacts();
    }
  }, [contractsAreReady]);

  return (
    <Web3Context.Provider
      value={{
        address: addressAccount,
        setAddress: setAddressAccount,
        tasks,
        setTasks,
        fetchTasks,
        createTask,
        toggleCompleted,
        balance,
        fetchBalance,
        sendEth,
        contacts,
        addNewContact,
      }}
    >
      {(() => {
        if (!web3) return null;

        return props.children;
      })()}
    </Web3Context.Provider>
  );
};
export default Web3Context;
