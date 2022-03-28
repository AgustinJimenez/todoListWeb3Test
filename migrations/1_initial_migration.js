const Migrations = artifacts.require("Migrations");
const TodoList = artifacts.require("TodoList");
const Pay = artifacts.require("Pay");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  //contracts
  deployer.deploy(TodoList);
  deployer.deploy(Pay);
};
