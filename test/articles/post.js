/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const mockFeed = require('../utils/feedDummy');

const url = '/api/v1/post-articles';
const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};
const { validData, invalidData } = mockFeed.creteArticle;


describe('Post an Article', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((error, res) => {
        // console.log(res);
        token = res.body.data.token;
        // console.log('Token: ', token);
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should return statusCode 201, Article successfully created', (done) => {
    request(app).post(url).set('x-access-token', token)
      .send(validData)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.include.key('message');
        expect(res.body.data).to.include.key('articleId');
        expect(res.body.data).to.include.key('title');
        expect(res.body.data).to.include.key('article');
        expect(res.body.data.message).to.equal('Article successfully posted');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Missing field values', (done) => {
    request(app).post(url).set('x-access-token', token)
      .send(invalidData)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Please fill all fields');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Token is not provided', (done) => {
    request(app).post(url)
      .send(validData)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Invalid access token', (done) => {
    request(app).post(url)
      .send(validData)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });
});
