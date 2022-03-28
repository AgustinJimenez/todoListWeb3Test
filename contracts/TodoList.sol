// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  string public name = 'MyApp';
  mapping(address => mapping(uint => Task)) public tasks;
  mapping(address => uint) public tasksCount;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  event TaskCreated (
    uint id,
    string content,
    bool completed
  );

  event TaskCompleted (
    uint id,
    bool completed
  );

  function createTask(string memory _content) public {
    uint tc = tasksCount[msg.sender];
    tasks[msg.sender][tc] = Task(tc, _content, false);
    emit TaskCreated(tc, _content, false);
    tasksCount[msg.sender]++;
  }

  function toggleCompleted(uint _id) public {
    Task memory task = tasks[msg.sender][_id];
    task.completed = !task.completed;
    tasks[msg.sender][_id] = task;
    emit TaskCompleted(_id, task.completed);
  }

  constructor() {

  }
}
