// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TasksContract {

    uint public taskCounter = 0;

    constructor () {
        createTask("mi primer tarea de ejemplo", "tengo que hacer algo");
    }

    // Already happened
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TaskToggleDone(uint256 id,bool done);

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        taskCounter ++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(taskCounter, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }
}

//https://www.youtube.com/watch?v=FAMWIoKvfRs =< 50:18