/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

const loginUrl = '/api/v1/auth/login';
const deleteUrl = '/api/v1/images/delete/33';
const failedDeleteUrl = '/api/v1/images/delete/34';

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};
const wrongUserCredentials = {
  email: 'iamugee@yahoo.com',
  password: 'password1',
};
const expiredToken = process.env.EXPIRED;

describe('Test Delete Image', () => {
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

  it('Should successfully delete an Image, 200 OK', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Image deleted successfully');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to delete, Image does not exist', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('This image might have been deleted or does not exist');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to delete, Invalid access token', (done) => {
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

describe('Test Failed Delete Image, Unauthorized user', () => {
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

  it('Should fail to delete, Not permitted', (done) => {
    request(app).delete(failedDeleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('You don\'t have permission to do this');
        done();
      })
      .catch((error) => console.log(error));
  });
});
