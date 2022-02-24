App = {

    contracts: {},

    init: async () => {
        console.log('app.js - init Loaded');
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        App.render();
        await App.renderTasks();
    },

    loadEthereum: async () => {
        if(window.ethereum){
            console.log('ethereum exists');
            App.web3Provider = window.ethereum;
            
        }else if(window.web3){
            web3 = new Web3(window.web3.currentProvider);
        }else{
            console.log('NO ethereum browser is installed');
        }
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const taskContractJSON = await res.json();
        
        App.contracts.tasksContract = TruffleContract(taskContractJSON);
        App.contracts.tasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    loadAccount: async () => {
        const account = 
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = account[0];
    },

    render: () => {
        document.getElementById("account").innerText = App.account;
    },

    renderTasks: async () => {
        const taskCounter = await App.tasksContract.taskCounter();
        const taskCounterNumber = taskCounter.toNumber();
        
        var html = '';

        for(let i = 0; i < taskCounterNumber; i++){
            const task = await App.tasksContract.tasks(i);
           
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];

            let taskElement = `
                <div class="card bg-dark mb-2"> 
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${taskTitle}</span>
                        <div class="form-check form-switch">
                            <input data-id="${taskId}" class="form-check-input" type="checkbox" ${taskDone && 'checked'} onchange="App.toggleDone(this)"/>
                        </div>
                    </div>
                    <div class="card-body">
                    <span>${taskDescription}</span>
                    <p class="text-muted">Task created at ${new Date(taskCreated * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `;

            html += taskElement;
        }

        document.getElementById("tasksList").innerHTML = html;

    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, {from: App.account});
        App.renderTasks();
    },

    toggleDone: async (element) => {
       await App.tasksContract.toggleDone(element.dataset.id, {from: App.account}); 

       App.renderTasks();
    }
}

App.init();

//https://youtu.be/FAMWIoKvfRs?t=8712

//1. Inicializar ganache
//2. en consola sudo truffle migrate
//3. npm run dev