const TasksContract = artifacts.require("TasksContract")

contract("TasksContract", () => {

    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    });

    it('migrate deployed successfully',  async () => {
        const address = this.tasksContract.address

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('get tasks list', async () => {
        const tasksCounter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(tasksCounter);

        assert.equal(task.id.toNumber(), tasksCounter);
        assert.equal(task.title, "mi primer tarea de ejemplo");
        assert.equal(task.description, "tengo que hacer algo");
        assert.equal(task.done, false);
        assert.equal(tasksCounter, 1);
    });

    it('task created succesfully', async () =>  {
        const result = await this.tasksContract.createTask("tarea 2", "desription 2");
        const taskEvent = result.logs[0].args;
        const tasksCounter = await this.tasksContract.taskCounter();

        assert.equal(tasksCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "tarea 2");
        assert.equal(taskEvent.description, "desription 2");
        assert.equal(taskEvent.done, false);
    });

    it('task toggle done', async () => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.tasksContract.tasks(1);

        assert.equal(task.done, true);
        assert.equal(taskEvent.id.toNumber(), 1);
        assert.equal(taskEvent.done, true);
    });
});

/**
 1. truffle console
 2. tasksContract = await TasksContract.deployed()
 3. tasksContract (enter)
 4. taskCreated = await tasksContract.createTask("tarea 2", "desription 2")
 5. taskCreated.logs[0].args
 */