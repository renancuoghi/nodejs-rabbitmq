const config = require('./config.json');
const Rabbitmq = require("./rabbitmq");
const fs = require('fs');
const dayjs = require('dayjs');


const rabbit = new Rabbitmq(config.rabbitmq_url);

const queuefile = `./queue_processing/${config.defaultQueue}.queue`;
const queuefile_error = `./queue_processing/${config.defaultQueue}_error.queue`;

// defaultQueue
console.log(`queue listener for ${config.defaultQueue} started.`);
rabbit.consume(config.defaultQueue, message => {
    const eventDate  = dayjs();
    const row = eventDate.format() + " " + message.content.toString() + "\r\n";

    fs.appendFile(queuefile, row, function (err) {
        if (err) {
            // if error, send to error queue.
            const qObj = {
                message : message.content,
                error: err.message,
                date: eventDate.format()
            };
            rabbit.sendToQueue(config.errorQueue, qObj, (err) => res.json({'message' : err},500));
        }
      });
}, error => {
    console.log(error);
})