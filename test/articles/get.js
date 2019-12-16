/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};


// console.log(token);

describe('GET All Article', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((error, res) => {
      // console.log(res);
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should return statusCode 200, OK', (done) => {
    request(app).get('/api/v1/get-all-articles').set('x-access-token', token)
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

  it('Should return statusCode 400, Invalid access token', (done) => {
    request(app).get('/api/v1/get-all-articles')
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });
});
