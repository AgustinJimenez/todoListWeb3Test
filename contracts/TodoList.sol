// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    string public name = "MyApp";
    mapping(address => mapping(uint256 => Task)) public tasks;
    mapping(address => uint256) public tasksCount;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    event TaskCreated(uint256 id, string content, bool completed);

    event TaskCompleted(uint256 id, bool completed);

    function createTask(string memory _content) public {
        uint256 address_task_count = tasksCount[msg.sender];
        Task memory new_task = Task(address_task_count, _content, false);
        tasks[msg.sender][address_task_count] = new_task;
        emit TaskCreated(address_task_count, _content, false);
        tasksCount[msg.sender]++;
    }

    function toggleCompleted(uint256 _id) public {
        Task memory task = tasks[msg.sender][_id];
        task.completed = !task.completed;
        tasks[msg.sender][_id] = task;
        emit TaskCompleted(_id, task.completed);
    }

    constructor() {}
}
