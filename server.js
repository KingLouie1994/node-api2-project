const express = require('express');
const router = require('./data/db/db-router');
const server = express();

server.use(express.json());
server.use('/api/posts', router);

server.get('/', (req, res) => {
  res.send('hello world');
});

module.exports = server;