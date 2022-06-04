# Nodejs + Rabbitmq

This project was created just to know how to work Nodejs with Rabbitmq

## Installation

Use docker-compose, docker-compose has a rabbitmq container and application container. The application is in nodejs-rabbitmq path.

```bash
sudo docker-compose up -d --build
```
## Default rabbitmq access
```bash
http://localhost:8080
user: guest
password: guest
```

In this example I'll use two queues, "queuetest" and "errors". Queuetest  is the default queue is "queuetest", errors will be used just with some error happened when the app tries to save.
All consume queue is written into a file (queue_processing/queuetest.queue)

## Application

## Backend Nodejs

Application container is running with nodemon, so all changes will update into container.
```bash
URL: http://localhost:5000
```
## Create a message
```bash
POST localhost:5000
{
    "messsage" : "my queue message"
}
```
You can send any message with json format.

## Consume queue 
To start consuming, you have to start the worker. The workers consume messages in the default queue and write them into a file (queue_processing/queuetest.queue).
```bash
# start worker
docker exec -it nodebackend bash
nodejs worker.js
```
After the queue listener will start. If you want to simulate a error (queue), one thing you can do is remove permissions at "queuetest.queue", after this the worker will try to write into file but won't have permission and will send the message for error queue.
```
# remove permissions
chmod 000 queue_processing/queuetest.queue
# back permissions
chmod 777 queue_processing/queuetest.queue
```


```
## License
[MIT](https://choosealicense.com/licenses/mit/)
```
