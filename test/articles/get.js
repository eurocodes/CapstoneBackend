/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

describe('GET All Article', () => {
  it('First creates a user', (done) => {
    request(app).post('/api/v1/auth/users')
      .send({
        email: 'thisisugee@yahoo.com', password: 'password1', firstName: 'Ugo', lastName: 'Ugo', department: 'IT', jobRole: 'Dev', isAdmin: false,
      })
      .then(() => {
        done();
      })
      .catch((error) => console.log(error));
  });
  it('Then post Article, OK', (done) => {
    request(app).post('/api/v1/post-articles').set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NzU0MTUyOTIsImV4cCI6MTU3NjAyMDA5Mn0.T-z8sM2Xmow9z4Ykw5Jz98jM6VV9_EwR0Q7kLOrsQ_Q')
      .send({
        title: 'My Article Title', article: 'This is the body of my article for test purposes',
      })
      .then(() => {
        done();
      })
      .catch((error) => console.log(error));
  });
  it('Then get Articles, OK', (done) => {
    request(app).get('/api/v1/get-all-articles').set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NzU0MTUyOTIsImV4cCI6MTU3NjAyMDA5Mn0.T-z8sM2Xmow9z4Ykw5Jz98jM6VV9_EwR0Q7kLOrsQ_Q')
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

  it('Failed to get, Invalid access token', (done) => {
    request(app).get('/api/v1/get-all-articles').set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1NzU0MTYyNDMsImV4cCI6MTU3NjAyMTA0M30.do-VAjmPTSChkh3zxtYBDIE8o5G2yu17rY7O-v3jtn0')
      .send({
        title: 'My Article Title', article: 'This is the body of my article for test purposes',
      })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('The token you provided is invalid');
        done();
      })
      .catch((error) => console.log(error));
  });
});
