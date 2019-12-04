/* eslint-disable linebreak-style */
const express = require('express');
const UserWithDB = require('./src/usingDB/controllers/User');
const ArticleCtrl = require('./src/usingObj/controllers/Article.controller');
const Auth = require('./src/usingDB/middleware/Auth');

const app = express();
app.use(express.json());
app.post('/api/v1/auth/users', UserWithDB.create);
app.post('/api/v1/auth/signin', UserWithDB.login);
app.post('/api/v1/post-articles', Auth.verifyToken, ArticleCtrl.create);
module.exports = app;
