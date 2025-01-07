class MessageBroker {
    constructor() {
        this.subscribers = new Map();
    }

    subscribe(topic, callback) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, []);
        }
        this.subscribers.get(topic).push(callback);
    }

    publish(topic, message) {
        if (this.subscribers.has(topic)) {
            this.subscribers.get(topic).forEach(callback => callback(message));
        }
    }
}