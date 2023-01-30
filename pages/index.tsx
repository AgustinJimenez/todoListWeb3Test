/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Web3Context from "../src/contexts/Web3Context";
import { IContact } from "../src/types";

const Home: NextPage = () => {
  return (
    <>
      <Header />

      <main className="container">
        <Row>
          <TodoList />
          <PayAddress />
        </Row>
      </main>

      <Footer />
    </>
  );
};

const TodoList = () => {
  const [input, setInput] = useState<string>("");
  const handleInputChange = (e: any) => setInput(e.currentTarget.value);
  const { tasks, fetchTasks, createTask, toggleCompleted } =
    useContext(Web3Context);
  const handleAddTask = async () => {
    await createTask(input);
    setInput("");
    fetchTasks();
  };

  const handleToggleCompleteState = async (id: any) => {
    await toggleCompleted(id);
    fetchTasks();
  };

  const init = async () => {
    fetchTasks();
  };

  const sendEth = () => {};

  useEffect(() => {
    // init();
  }, []);

  return (
    <div className="col">
      <Card body className="text-center">
        <Card.Title>TODO LIST WEB3</Card.Title>

        <Row>
          <div className="col col-md-6 col-xs-12">
            <Row className="mb-2">
              <div className="col-md-8 col-xs-12 px-0">
                <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                  Name
                </Form.Label>
                <Form.Control
                  id="inlineFormInput"
                  placeholder="Introduce your task"
                  onChange={handleInputChange}
                  value={input}
                />
              </div>
              <div className="col-md-4 col-xs-12">
                <Button
                  className="mb-2"
                  onClick={handleAddTask}
                  disabled={!input.trim().length}
                >
                  Save
                </Button>
              </div>
            </Row>
            <Row>
              <Col xs={12}>
                <ListGroup>
                  {tasks.map((task, key) => (
                    <ListGroup.Item key={key}>
                      <div className="row">
                        <div className="col col-xs-10">{task.content}</div>
                        <div className="col col-xs-2">
                          <Button
                            onClick={() => handleToggleCompleteState(task.id)}
                          >
                            {task?.completed ? "COMPLETE" : "INCOMPLETE"}
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </div>
        </Row>
      </Card>
    </div>
  );
};

const PayAddress = () => {
  const { address, balance, fetchBalance, sendEth, contacts, addNewContact } =
    useContext(Web3Context);
  const init = async () => {
    fetchBalance();
  };
  const [contactName, setContactName] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const clearContactInputs = () => {
    setContactAddress("");
    setContactName("");
  };
  const contactIsInValid =
    !contactName.trim().length ||
    !(window as any).web3.utils.isAddress(contactAddress) ||
    contactAddress === address ||
    contacts
      .map(({ wallet_address }) => wallet_address)
      .includes(contactAddress);
  const submitContact = async () => {
    await addNewContact({
      full_name: contactName,
      address: contactAddress,
    });
    clearContactInputs();
  };
  const sendPay = useCallback((contact_id: any, amount_in_eth: number) => {
    sendEth(contact_id, amount_in_eth);
  }, []);

  useEffect(() => {
    //init();
  }, []);
  return (
    <div className="col">
      <Card body className="text-center">
        <Card.Title>Pay Address </Card.Title>
        <Row>
          <div className="col">Your balance: {balance} eth</div>
        </Row>

        <Row>
          <div className="col-md-4">
            <b>Add new contact</b>
          </div>
        </Row>

        <Row className="mt-2">
          <div className="col-md-5 col-xs-12">
            <Form.Label visuallyHidden>Name</Form.Label>
            <Form.Control
              placeholder="Introduce contact name"
              onChange={(event: any) => setContactName(event.target.value)}
              value={contactName}
            />
          </div>
          <div className="col-md-5 col-xs-12">
            <Form.Label visuallyHidden>Address</Form.Label>
            <Form.Control
              placeholder="Introduce contact address"
              onChange={(event: any) => setContactAddress(event.target.value)}
              value={contactAddress}
            />
          </div>
          <div className="col-md-2 col-xs-12">
            <Button
              className="mb-2"
              onClick={submitContact}
              disabled={contactIsInValid}
            >
              Add
            </Button>
          </div>
        </Row>
        <hr />
        <Row>
          <div className="col-xs-12 mx-0 px-0">
            <ListGroup>
              {contacts?.map?.((contact: IContact, id: number) => (
                <ListGroup.Item key={id}>
                  <div className="row">
                    <div className="col col-xs-3">{contact?.full_name}</div>
                    <div className="col col-xs-3">
                      {contact?.wallet_address}
                    </div>
                    <div className="col col-xs-2">
                      <Button onClick={() => sendPay(id, 0.4)}>
                        Pay 0.4 eth
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Row>
      </Card>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </Container>
    </footer>
  );
};

const Header = () => {
  return (
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
export default Home;
