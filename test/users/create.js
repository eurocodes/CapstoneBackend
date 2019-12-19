/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const mockData = require('../utils/userDummy');

const url = '/api/v1/auth/sign-up';
const { validUser, invalidEmail, missingValue } = mockData.createUser;

describe('Create a new user', () => {
  it('Should return statusCode 201, User successfully created', (done) => {
    request(app).post(url)
      .send(validUser)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.include.key('message');
        expect(res.body.data).to.include.key('token');
        expect(res.body.data).to.include.key('userid');
        expect(res.body.data.message).to.equal('User account successfully created');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Failed, Invalid email address ', (done) => {
    request(app).post(url)
      .send(invalidEmail)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Please enter a valid email address');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should return statusCode 400, Failed, Missing details ', (done) => {
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
