const express = require('express');
const UserWithDB = require('./src/usingDB/controllers/User');

const app = express();

app.use(express.json());

app.post('/api/v1/users', UserWithDB.create);

module.exports = app;