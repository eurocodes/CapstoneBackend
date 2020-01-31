/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

const loginUrl = '/api/v1/auth/login';
const getAllItemsUrl = '/api/v1/get-all-items';
const getOneArticleUrl = '/api/v1/get/items/31';

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};
const expiredToken = process.env.EXPIRED;

describe('GET All Article', () => {
  let token;
  before((done) => {
    request(app).post(loginUrl)
      .send(userCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should return statusCode 200, OK', (done) => {
    request(app).get(getAllItemsUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.a('Array');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 401, Token is not provided', (done) => {
    request(app).get(getAllItemsUrl)
      .then((res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Invalid access token', (done) => {
    request(app).get(getAllItemsUrl).set('x-access-token', expiredToken)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('name');
        expect(res.body).to.include.key('message');
        expect(res.body).to.include.key('expiredAt');
        expect(res.body.name).to.equal('TokenExpiredError');
        expect(res.body.expiredAt).to.equal('2020-01-29T07:12:55.000Z');
        done();
      })
      .catch((error) => console.log(error));
  });
});

describe('GET One Item', () => {
  let token;
  before((done) => {
    request(app).post(loginUrl)
      .send(userCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should return statusCode 200, OK', (done) => {
    request(app).get(getOneArticleUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body).to.include.keys('comments');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.a('Object');
        expect(res.body.comments).to.be.a('Array');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 401, Token is not provided', (done) => {
    request(app).get(getOneArticleUrl)
      .then((res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Invalid access token', (done) => {
    request(app).get(getOneArticleUrl).set('x-access-token', expiredToken)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('name');
        expect(res.body).to.include.key('message');
        expect(res.body).to.include.key('expiredAt');
        expect(res.body.name).to.equal('TokenExpiredError');
        expect(res.body.expiredAt).to.equal('2020-01-29T07:12:55.000Z');
        done();
      })
      .catch((error) => console.log(error));
  });
});
