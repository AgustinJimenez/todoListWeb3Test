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
    uint address_task_count = tasksCount[msg.sender];
    Task memory new_task = Task(address_task_count, _content, false);
    tasks[msg.sender][address_task_count] = new_task;
    emit TaskCreated(address_task_count, _content, false);
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
