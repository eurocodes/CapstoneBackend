/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const mockData = require('../utils/userDummy');

const url = '/api/v1/auth/login';

const { validDetails, invalidDetails, missingValue } = mockData.login;

describe('Test for User signin, 200 OK', () => {
  it('Should let a user successfully sign in', (done) => {
    request(app).post(url)
      .send(validDetails)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.include.key('token');
        expect(res.body.data).to.include.key('userid');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to sign in, Invalid credentials', (done) => {
    request(app).post(url)
      .send(invalidDetails)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('The credentials you provided is incorrect');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to signin, Incomplete credentials', (done) => {
    request(app).post(url)
      .send(missingValue)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Some values are missing');
        done();
      })
      .catch((error) => console.log(error));
  });
});
