class Actor {
    constructor(broker) {
        this.broker = broker;
        this.mailbox = [];
        this.processing = false;
    }

    async receive(message) {
        this.mailbox.push(message);
        await this.processMailbox();
    }

    async processMailbox() {
        if (this.processing) return;
        this.processing = true;

        while (this.mailbox.length > 0) {
            const message = this.mailbox.shift();
            await this.handleMessage(message);
        }

        this.processing = false;
    }

    async handleMessage(message) {
        throw new Error('handleMessage must be implemented');
    }
}