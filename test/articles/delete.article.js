/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

const loginUrl = '/api/v1/auth/login';
const deleteUrl = '/api/v1/feeds/delete/56';
const failedDeleteUrl = '/api/v1/feeds/delete/57';

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};
const wrongUserCredentials = {
  email: 'iamugee@yahoo.com',
  password: 'password1',
};
const expiredToken = process.env.EXPIRED;

describe('Delete Article', () => {
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

  it('Should return statusCode 200, Article deleted successfully', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Item deleted successfully');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 404, Article does not exist', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('This article might have been deleted or does not exist');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Invalid access token', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', expiredToken)
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

describe('Failed Delete Article', () => {
  let token;
  before((done) => {
    request(app).post(loginUrl)
      .send(wrongUserCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('Should return statusCode 404, Not permitted', (done) => {
    request(app).delete(failedDeleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('You don\'t have permission to do this');
        done();
      })
      .catch((error) => console.log(error));
  });
});
