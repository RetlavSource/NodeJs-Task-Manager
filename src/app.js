const express = require('express');
require('./db/mongoose'); // Only connects to the mongodb database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Welcome to the Task Manager API!</h1>');
    res.end();
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;