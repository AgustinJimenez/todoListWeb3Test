//@ts-nocheck
import React, { useEffect } from "react";
import Web3 from "web3";
import TodoListJSON from "../../build/contracts/TodoList.json";
import PayJSON from "../../build/contracts/Pay.json";
import { weiToEth } from "../utils";
const contract = require("@truffle/contract");

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
};

export const Web3Context = React.createContext<CtxProps>(CtxDefaultValues);

export const Web3ContextProvider = (props: any) => {
  const [web3IsLoad, setWeb3IsLoadTo] = React.useState<boolean>(false);
  const [contractsAreLoaded, setContractsAreLoaded] =
    React.useState<boolean>(false);
  const [networkId, setNetworkId] = React.useState();
  const [addressAccount, setAddressAccount] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [balance, setBalance] = React.useState(0);

  const [todoContract, setTodoContract] = React.useState();
  const [payContract, setPayContract] = React.useState();

  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        await window.web3.eth.sendTransaction({});
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      await window.web3.eth.sendTransaction({});
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadTodoContract = async () => {
    const deployedNetwork = TodoListJSON.networks[networkId];
    const todoCntr = new web3.eth.Contract(
      TodoListJSON.abi,
      deployedNetwork && deployedNetwork.address
    );
    setTodoContract(todoCntr);
  };

  const loadPayContract = async () => {
    const deployedNetwork = PayJSON.networks[networkId];
    const payCntr = new web3.eth.Contract(
      PayJSON.abi,
      deployedNetwork && deployedNetwork.address
    );
    setPayContract(payCntr);
  };

  const createTask = async (content: string) => {
    await todoContract.methods
      .createTask(content)
      .send({ from: addressAccount });
  };

  const toggleCompleted = async (id) => {
    await todoContract.methods
      .toggleCompleted(id)
      .send({ from: addressAccount });
  };

  const fetchDefaultAccount = async () => {
    const accounts = await window?.web3?.eth?.requestAccounts();
    const defaultAccount = accounts?.[0];
    setAddressAccount(defaultAccount);
  };

  const fetchBalance = async () => {
    const balance = await web3.eth.getBalance(addressAccount);
    const ethAmmount = weiToEth(balance).toFixed(3);
    setBalance(ethAmmount);
  };

  const getContacts = async () => {
    // const contacts = await payContract.methods.helloWorld().call();
    // console.log(contacts);
  };

  const fetchTasks = async () => {
    const tasksCount = await todoContract.methods
      .tasksCount(addressAccount)
      .call();

    const tasks = [];
    for (let i = 0; i < +tasksCount; i++) {
      const task = await todoContract.methods.tasks(addressAccount, i).call();
      tasks.push(task);
    }
    setTasks(tasks);
  };

  const loadContracts = async () => {
    await loadPayContract();
    await loadTodoContract();

    //
    setContractsAreLoaded(true);
    setWeb3IsLoadTo(true);
  };

  const loadNetworkId = async () => {
    const networkId = await web3.eth.net.getId();
    setNetworkId(networkId);
  };
  const init = async () => {
    try {
      await loadWeb3();
      await fetchDefaultAccount();
      await loadNetworkId();
    } catch (error) {
      console.log("INIT ERROR: ", error);
    }
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (!!networkId) loadContracts();
  }, [networkId]);
  useEffect(() => {
    if (!!contractsAreLoaded) getContacts();
  }, [contractsAreLoaded]);
  // console.log("\n\n RENDER ===> ", { tasks });
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
      }}
    >
      {(() => {
        if (!Boolean(web3IsLoad)) return null;

        return props.children;
      })()}
    </Web3Context.Provider>
  );
};
export default Web3Context;
