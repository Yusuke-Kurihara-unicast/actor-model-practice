class TaskScheduler extends Actor {
    constructor(broker) {
        super(broker);
        this.taskQueue = [];
        this.workers = new Map();
        this.completedTasks = 0;
        this.broker.subscribe('worker-available', (workerId) => this.assignNextTask(workerId));
        this.broker.subscribe('task-completed', () => {
            this.completedTasks++;
            this.updateStats();
        });
    }

    registerWorker(worker) {
        this.workers.set(worker.id, worker);
        this.updateStats();
        this.assignNextTask(worker.id);
    }

    removeWorker(workerId) {
        this.workers.delete(workerId);
        this.updateStats();
    }

    async handleMessage(message) {
        if (message.type === 'new-task') {
            this.taskQueue.push(message.task);
            this.updateTaskQueue();
            this.assignNextTask();
        }
    }

    assignNextTask(preferredWorkerId = null) {
        if (this.taskQueue.length === 0) return;

        let worker = null;
        if (preferredWorkerId && this.workers.has(preferredWorkerId)) {
            worker = this.workers.get(preferredWorkerId);
            if (worker.isBusy) worker = null;
        }

        if (!worker) {
            for (const [, w] of this.workers) {
                if (!w.isBusy) {
                    worker = w;
                    break;
                }
            }
        }

        if (worker) {
            const task = this.taskQueue.shift();
            worker.receive({ type: 'task', task });
            this.updateTaskQueue();
        }
    }

    updateStats() {
        document.getElementById('workerCount').textContent = this.workers.size;
        document.getElementById('activeTaskCount').textContent = this.taskQueue.length;
        document.getElementById('completedTaskCount').textContent = this.completedTasks;
    }

    updateTaskQueue() {
        const queueElement = document.getElementById('taskQueue');
        queueElement.innerHTML = this.taskQueue.length > 0 
            ? `待機中のタスク: ${this.taskQueue.length}個`
            : 'タスクなし';
    }
}