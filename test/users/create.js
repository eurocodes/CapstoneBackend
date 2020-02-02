/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const mockData = require('../utils/userDummy');

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};

const url = '/api/v1/auth/sign-up';
const { validUser, invalidEmail, missingValue } = mockData.createUser;

describe('Test for Create a new user', () => {
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
  it('Should successfully create a new user (Only Admin can)', (done) => {
    request(app).post(url).set('x-access-token', token)
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

  it('Should fail to create give an Invalid email address ', (done) => {
    request(app).post(url).set('x-access-token', token)
      .send(invalidEmail)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Please enter a valid email address');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to create user, Missing details ', (done) => {
    request(app).post(url).set('x-access-token', token)
      .send(missingValue)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Some values are missing');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Should fail to cerate, Token is not provided ', (done) => {
    request(app).post(url).set('x-access-token', '')
      .send(invalidEmail)
      .then((res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });
});
