

class Rabbitmq {
    constructor(rabbitmq_url) {
        this.amqp = require('amqplib');
        this.connection = null;
        this.rabbitmq_url = rabbitmq_url;
    }

    connect(){
        if(this.connection === null){
            this.connection = this.amqp.connect(this.rabbitmq_url)
                .then(conn => conn.createChannel());
        }
        return this.connection;
    }

    createQueue(channel, queue) {
        return new Promise((resolve, reject) => {
            try{
                channel.assertQueue(queue, {durable: true});
                resolve(channel);
            }catch(err){
                reject(err);
            }
        });
    }

    createChannel(queue) {
        return this.connect()
            .then(channel => this.createQueue(channel, queue));
    }

    sendToQueue(queue, message, callbackError) {
        this.createChannel(queue)
            .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
            .catch(err => {
                if(typeof callbackError === 'function'){
                    callbackError(err);
                }else{
                    throw err;
                }
            });
    }

    consume(queue, callback, callbackError) {
        this.createChannel(queue)
            .then(channel => channel.consume(queue, callback, { noAck: true }))
            .catch(err => {
                if(typeof callbackError === 'function'){
                    callbackError(err);
                }else{
                    throw err;
                }
            });
    }

};

module.exports = Rabbitmq;