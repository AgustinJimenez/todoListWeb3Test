//@ts-nocheck
import React, { useEffect } from "react";
import Web3 from "web3";
import contract from "@truffle/contract";
import TodoListJSON from "../../build/contracts/TodoList.json";
import PayJSON from "../../build/contracts/Pay.json";
import { weiToEth } from "../utils";

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
  const [addressAccount, setAddressAccount] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [balance, setBalance] = React.useState(0);
  const [todoContract, setTodoContract] = React.useState({});
  const [payContract, setPayContract] = React.useState({});

  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadTodoContract = async () => {
    let todoCntr = contract(TodoListJSON);
    todoCntr.setProvider(web3?.eth?.currentProvider);
    todoCntr = await todoCntr.deployed();
    setTodoContract(todoCntr);
  };

  const loadPayContract = async () => {
    let payCntr = contract(PayJSON);
    payCntr.setProvider(web3?.eth?.currentProvider);
    payCntr = await payCntr.deployed();
    setPayContract(payCntr);
  };

  const createTask = async (content: string) => {
    await todoContract.createTask(content, { from: addressAccount });
  };

  const toggleCompleted = async (id) => {
    await todoContract.toggleCompleted(id, { from: addressAccount });
  };

  const fetchAccount = async () => {
    const accounts = await web3.eth.requestAccounts();
    setAddressAccount(accounts[0]);
  };

  const fetchBalance = async () => {
    const balance = await payContract?.getBalance(addressAccount);
    const ethAmmount = weiToEth(balance.words[0]);
    setBalance(ethAmmount);
  };

  const fetchTasks = async () => {
    const tasksCount = await todoContract.tasksCount(addressAccount);
    const tasks = [];
    for (var i = 0; i < tasksCount; i++) {
      const task = await todoContract.tasks(addressAccount, i);
      tasks.push(task);
    }
    setTasks(tasks);
  };

  const loadContracts = async () => {
    await loadTodoContract();
    await loadPayContract();
  };

  const init = async () => {
    await loadWeb3();
    await fetchAccount();
    await loadContracts();
    //
    setWeb3IsLoadTo(true);
  };

  useEffect(() => {
    init();
  }, []);

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
      {web3IsLoad && props.children}
    </Web3Context.Provider>
  );
};
export default Web3Context;
