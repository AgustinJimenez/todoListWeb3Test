//@ts-nocheck
import React, { useEffect, useState } from "react";
import MainJSON from "../artifacts/contracts/Main.sol/Main.json";
import TodoListJSON from "../artifacts/contracts/TodoList.sol/TodoList.json";
import { weiToEth } from "../utils";
import { IContact } from "../interfaces";
import Web3 from "web3";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { contracts_address } from "../../config.json";

interface ITask {
  id: number;
  content?: string;
  completed?: boolean;
}

interface CtxProps {
  web3: any;
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
  web3: null,
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

type ContractsState = {
  mainContract?: any;
  todoContract?: any;
};

export const Web3ContextProvider = (props: any) => {
  const account = useAccount();
  const [ready, setReady] = React.useState(false);
  const [web3, setWeb3] = React.useState<Web3>();
  const [contractsAreReady, setContractsAreReady] = React.useState(false);
  const [networkId, setNetworkId] = React.useState();
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [balance, setBalance] = React.useState(0);
  const [contacts, setContacts] = React.useState<IContact[]>([]);

  const [contracts, setContracts] = React.useState<ContractsState>();

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
      if (debug)
        response =
          (await contract.methods[method](...args)[
            sendOptions ? "send" : "call"
          ](sendOptions)) || defaultValue;
      //
    } catch (error) {
      if (debug)
        console.log(
          "\n\n executeContractMethod error: ",
          { error, options },
          "\n\n"
        );
    }
    return response;
  };

  const setContractWithWeb3JsLib = async ({ abi, address }) => {
    return new web3.eth.Contract(abi, address);
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
      contract: contracts.todoContract,
      method: "createTask",
      args: [content],
      typeExecution: "send",
      sendOptions: { from: account.address },
    });
  };

  const toggleCompleted = async (id) => {
    await executeContractMethod({
      contract: contracts.todoContract,
      method: "toggleCompleted",
      args: [id],
      typeExecution: "send",
      sendOptions: { from: account.address },
    });
  };

  const fetchContacts = async () => {
    const contacts = await executeContractMethod({
      contract: contracts.mainContract,
      method: "getContacts()",
      args: [],
      defaultValue: [],
    });
    setContacts(contacts);
  };

  const addNewContact = async ({ full_name, address }) => {
    await executeContractMethod({
      contract: contracts.mainContract,
      method: "addContact",
      args: [full_name, address],
      typeExecution: "send",
      sendOptions: { from: account.address },
    });
  };

  const sendEth = async (contact_id: any, amount_in_eth: number) => {
    const amount_in_wei = web3.utils.toWei(String(amount_in_eth), "ether");
    // await payContract.methods.payEthToContact(contact_id).send({ from: addressAccount, value: amount_in_wei });
    await executeContractMethod({
      contract: contracts.mainContract,
      method: "payEthToContact",
      args: [contact_id],
      typeExecution: "send",
      sendOptions: { from: account.address, value: amount_in_wei },
    });
    fetchBalance();
  };

  const fetchBalance = async () => {
    let balance = await web3.eth.getBalance(account.address);
    balance = weiToEth(balance, web3).toFixed(3);
    setBalance(balance);
  };

  const fetchTasks = async () => {
    const tasksCount = await executeContractMethod({
      contract: contracts.todoContract,
      method: "tasksCount",
      args: [account.address],
      defaultValue: 0,
    });

    const tasks = [];
    for (let i = 0; i < +tasksCount; i++) {
      const task = await executeContractMethod({
        contract: contracts.todoContract,
        method: "tasks",
        args: [account.address, i],
      });
      await contracts.todoContract.methods.tasks(account.address, i).call();

      tasks.push(task);
    }
    setTasks(tasks);
  };

  const setContractsEventHandlers = () => {
    contracts.mainContract?.events?.NewContactWasCreated(newContactWasCreated);
  };

  const loadContracts = async () => {
    setContracts({
      todoContract: await setContractWithWeb3JsLib({
        abi: TodoListJSON.abi,
        address: contracts_address.TodoList,
      }),
      mainContract: await setContractWithWeb3JsLib({
        abi: MainJSON.abi,
        address: contracts_address.Main,
      }),
    });
  };
  const init = async () => {
    try {
      loadWeb3();
    } catch (error) {
      console.log("INIT ERROR: ", error);
    }
  };

  //first -> web3 is loaded
  useEffect(() => {
    init();
  }, []);

  //second -> contractsAreReady to true
  useEffect(() => {
    if (web3) loadContracts();
  }, [web3]);

  //third set contracts handlers
  useEffect(() => {
    if (contracts) {
      setContractsEventHandlers();
      setReady(true);
    }
  }, [contracts]);

  // fourth: everything is ready
  useEffect(() => {
    if (ready) {
      fetchContacts();
    }
  }, [ready]);

  return (
    <Web3Context.Provider
      value={{
        web3,
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
        if (!contracts) return null;

        return props.children;
      })()}
    </Web3Context.Provider>
  );
};
export default Web3Context;
