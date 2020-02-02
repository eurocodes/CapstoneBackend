/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const mockFeed = require('../utils/feedDummy');

const url = '/api/v1/articles/modify/15';
const userCredentials = {
  email: 'ugonna220@yahoo.com',
  password: 'password1',
};
const wrongUserCredentials = {
  email: 'thisisugee@yahoo.com',
  password: 'password1',
};
const { validData } = mockFeed.createArticle;

describe('Test Update an Article', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/login')
      .send(userCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should successfully Update an article given the :id', (done) => {
    request(app).put(url).set('x-access-token', token)
      .send(validData)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body).to.include.keys('feed_id');
        expect(res.body).to.include.keys('title');
        expect(res.body).to.include.key('feed');
        expect(res.body).to.include.key('owner_id');
        expect(res.body.owner_id).to.be.a('number');
        done();
      })
      .catch((error) => console.log(error));
  });
});

describe('Test Fail Update', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/login')
      .send(wrongUserCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('Should fail to update article, Not permitted, returns statusCode 404', (done) => {
    request(app).put(url).set('x-access-token', token)
      .send(validData)
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('You don\'t have permission to do this');
        done();
      })
      .catch((error) => console.log(error));
  });
});
