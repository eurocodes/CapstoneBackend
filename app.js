/* eslint-disable linebreak-style */
const express = require('express');
const UserWithDB = require('./src/usingDB/controllers/User');

const app = express();
app.use(express.json());
app.post('/api/v1/users', UserWithDB.create);
app.post('/api/v1/signin', UserWithDB.login);
module.exports = app;
