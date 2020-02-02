/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');

const commentUrl = '/api/v1/images/post/comments/9';
const notFoundUrl = '/api/v1/images/post/comments/2';
const deleteUrl = '/api/v1/images/comments/delete/21';
const adminDelete = '/api/v1/images/comments/delete/22';
const unAuthDelete = '/api/v1/images/comments/delete/23';

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};

const adminCredentials = {
  email: 'ugonna220@yahoo.com',
  password: 'password1',
};

const unauthUser = {
  email: 'thisisugee@yahoo.com',
  password: 'password1',
};

describe('Test Image comment', () => {
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

  it('Should successfully comment on an image', (done) => {
    request(app).post(commentUrl).set('x-access-token', token)
      .send({ comment: 'Nice pic' })
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('Object');
        expect(res.body.data).to.include.keys('message');
        expect(res.body.data).to.include.keys('comment_id');
        expect(res.body.data).to.include.keys('comment');
        expect(res.body.data).to.include.keys('commentBy');
        expect(res.body.data.message).to.be.a('string');
        expect(res.body.data.comment_id).to.be.a('number');
        expect(res.body.data.message).to.equal('Comment successfully posted');
        done();
      });
  });

  it('Should send another comment to balance', (done) => {
    request(app).post(commentUrl).set('x-access-token', token)
      .send({ comment: 'Nice one!!!' })
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('Object');
        expect(res.body.data).to.include.keys('message');
        expect(res.body.data).to.include.keys('comment_id');
        expect(res.body.data).to.include.keys('comment');
        expect(res.body.data).to.include.keys('commentBy');
        expect(res.body.data.message).to.be.a('string');
        expect(res.body.data.comment_id).to.be.a('number');
        expect(res.body.data.message).to.equal('Comment successfully posted');
        done();
      });
  });

  it('Should fail to comment on an Image, "Image not found"', (done) => {
    request(app).post(notFoundUrl).set('x-access-token', token)
      .send({ comment: 'What a nicelly written article' })
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Cannot be found');
        done();
      });
  });

  it('Should delete comment, deleted by comment owner', (done) => {
    request(app).delete(deleteUrl).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Comment deleted successfully');
        done();
      });
  });
});

describe('Admin Authorization Allowed', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/login')
      .send(adminCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('Should allow an admin to delete an abusive comment', (done) => {
    request(app).delete(adminDelete).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Comment deleted successfully');
        done();
      });
  });
});

describe('Unauthorized person not allowed', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/login')
      .send(unauthUser)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('Should not allow an unauthorized person delete comment', (done) => {
    request(app).delete(unAuthDelete).set('x-access-token', token)
      .then((res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('You don\'t have permission to do this');
        done();
      });
  });
});
