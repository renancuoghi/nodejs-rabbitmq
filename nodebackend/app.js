const config = require('./config.json');
const express = require('express');
const Rabbitmq = require("./rabbitmq");

const rabbit = new Rabbitmq(config.rabbitmq_url);

const app = express();

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');    
    await rabbit.sendToQueue('queue1', 'Message test', (err) => res.json({'message' : err},500));
    res.json({'message' : 'running!!'});
});

app.get('/consume', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    await rabbit.consume('queue1',  (message) => {
        res.json({'message' : message.content.toString()})
    }, (err) => {res.json({'message' : err},500)   });
});

app.listen(config.port, () => {
    console.log(`Now listening on port ${config.port}`); 
});