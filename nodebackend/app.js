const config = require('./config.json');
const express = require('express');
const Rabbitmq = require("./rabbitmq");
const bodyParser = require('body-parser');
const rabbit = new Rabbitmq(config.rabbitmq_url);

const app = express();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    await rabbit.sendToQueue(config.defaultQueue, req.body, (err) => res.json({'message' : err},500));
    res.json({'message' : 'message into queue!!'});
});


app.listen(config.port, () => {
    console.log(`Now listening on port ${config.port}`); 
});