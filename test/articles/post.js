/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

describe('To post an Article', () => {
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
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.include.key('message');
        expect(res.body.data).to.include.key('articleId');
        expect(res.body.data).to.include.key('title');
        expect(res.body.data).to.include.key('article');
        expect(res.body.data.message).to.equal('Article successfully posted');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Failed to post, Token is not provided', (done) => {
    request(app).post('/api/v1/post-articles')
      .send({
        title: 'My Article Title', article: 'This is the body of my article for test purposes',
      })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.include.key('message');
        expect(res.body.message).to.equal('Token is not provided');
        done();
      })
      .catch((error) => console.log(error));
  });

  it('Failed to post, Invalid access token', (done) => {
    request(app).post('/api/v1/post-articles').set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1NzU0MTYyNDMsImV4cCI6MTU3NjAyMTA0M30.do-VAjmPTSChkh3zxtYBDIE8o5G2yu17rY7O-v3jtn0')
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
