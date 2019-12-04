/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

describe('Create a new user', () => {
  it('Create a User, OK', (done) => {
    request(app).post('/api/v1/auth/users')
      .send({
        email: 'iamugee@yahoo.com', password: 'password1', firstName: 'Ugo', lastName: 'Ugo', department: 'IT', jobRole: 'Dev', isAdmin: false,
      })
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

  it('Fails to create, ', (done) => {
    request(app).post('/api/v1/auth/users')
      .send({
        email: 'iamugee@yahoo.com', password: 'password1', firstName: 'Ugo', lastName: 'Ugo', department: 'IT', jobRole: 'Dev', isAdmin: false,
      })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Email address already exist');
        done();
      })
      .catch((error) => console.log(error));
  });
});
