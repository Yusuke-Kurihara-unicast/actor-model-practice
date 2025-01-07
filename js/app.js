// アプリケーション管理
let workerIdCounter = 1;
const broker = new MessageBroker();
const scheduler = new TaskScheduler(broker);

function addWorker() {
    const worker = new WorkerActor(broker, `W${workerIdCounter++}`);
    scheduler.registerWorker(worker);
}

function removeWorker(workerId) {
    const workerElement = document.querySelector(`.worker-card:has(button[onclick*="${workerId}"])`);
    if (workerElement) {
        workerElement.remove();
        scheduler.removeWorker(workerId);
    }
}

function addRandomTasks() {
    const count = parseInt(document.getElementById('taskCount').value) || 5;
    const tasks = Array.from({ length: count }, (_, i) => 
        `タスク${Math.floor(Math.random() * 1000)}`
    );
    
    tasks.forEach(task => {
        scheduler.receive({ type: 'new-task', task });
    });
}

// 初期ワーカーを追加
addWorker();
addWorker();