class WorkerActor extends Actor {
    constructor(broker, id) {
        super(broker);
        this.id = id;
        this.isBusy = false;
        this.currentTask = null;
        this.element = this.createWorkerElement();
    }

    async handleMessage(message) {
        if (message.type === 'task') {
            this.isBusy = true;
            this.currentTask = message.task;
            this.updateDisplay();

            // タスク実行をシミュレート
            const duration = Math.random() * 2000 + 1000; // 1-3秒
            await new Promise(resolve => setTimeout(resolve, duration));

            this.log(`タスク完了: ${this.currentTask}`);
            this.broker.publish('task-completed', this.id);
            
            this.isBusy = false;
            this.currentTask = null;
            this.updateDisplay();
            this.broker.publish('worker-available', this.id);
        }
    }

    createWorkerElement() {
        const element = document.createElement('div');
        element.className = 'worker-card';
        element.innerHTML = `
            <h3>Worker ${this.id}</h3>
            <div class="status">待機中</div>
            <button class="remove" onclick="removeWorker('${this.id}')">削除</button>
        `;
        document.getElementById('workersContainer').appendChild(element);
        return element;
    }

    updateDisplay() {
        this.element.className = `worker-card${this.isBusy ? ' busy' : ''}`;
        const statusElement = this.element.querySelector('.status');
        statusElement.textContent = this.isBusy 
            ? `処理中: ${this.currentTask}`
            : '待機中';
    }

    log(message) {
        const logElement = document.getElementById('log');
        const logEntry = document.createElement('div');
        logEntry.textContent = `${new Date().toLocaleTimeString()} - Worker ${this.id}: ${message}`;
        logElement.insertBefore(logEntry, logElement.firstChild);
    }
}