/* eslint-disable linebreak-style */
const express = require('express');
const fileUpload = require('express-fileupload');
const UserWithDB = require('./src/usingDB/controllers/User');
const ArticleCtrl = require('./src/usingObj/controllers/Article.controller');
const GifCtrl = require('./src/usingObj/controllers/Gif.controller');
const ArticleCommentCtrl = require('./src/usingObj/controllers/Article.comment');
const GifCommentCtrl = require('./src/usingObj/controllers/Gif.comment');
const Auth = require('./src/usingDB/middleware/Auth');

const app = express();
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.get('/api/v1/get-all-items', Auth.verifyToken, ArticleCtrl.getAll);
app.get('/api/v1/get/items/:id', Auth.verifyToken, ArticleCtrl.getOneItem);
app.get('/api/v1/get/images/:id', Auth.verifyToken, GifCtrl.getOneItem);
app.post('/api/v1/post/articles', Auth.verifyToken, ArticleCtrl.create);
app.put('/api/v1/articles/modify/:id', Auth.verifyToken, ArticleCtrl.modify);
app.put('/api/v1/images/modify/:id', Auth.verifyToken, GifCtrl.modify);
app.post('/api/v1/post/gifs', Auth.verifyToken, GifCtrl.postGif);
app.post('/api/v1/auth/login', UserWithDB.login);
app.post('/api/v1/auth/sign-up', Auth.verifyToken, UserWithDB.create);
app.delete('/api/v1/feeds/delete/:id', Auth.verifyToken, ArticleCtrl.delete);
app.delete('/api/v1/images/delete/:id', Auth.verifyToken, GifCtrl.delete);
app.post('/api/v1/articles/post/comments/:id', Auth.verifyToken, ArticleCommentCtrl.create);
app.post('/api/v1/images/post/comments/:id', Auth.verifyToken, GifCommentCtrl.create);
app.get('/api/v1/articles/comments/:id', Auth.verifyToken, ArticleCommentCtrl.getAllComments);
app.get('/api/v1/images/comments/:id', Auth.verifyToken, GifCommentCtrl.getAllComments);
app.delete('/api/v1/articles/comments/delete/:id', Auth.verifyToken, ArticleCommentCtrl.delete);
app.delete('/api/v1/images/comments/delete/:id', Auth.verifyToken, GifCommentCtrl.delete);

module.exports = app;
