/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');

const app = require('../../app');

const imgDir = 'test/utils/image/Caterpillar.jpg';
const url = '/api/v1/post-a-gif';

const userCredentials = {
  email: 'laryhug209@yahoo.com',
  password: 'password1',
};

describe('Post a gif/image', () => {
  let token;
  before((done) => {
    request(app).post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((error, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('Should return statusCode 201, Gif successfully posted', (done) => {
    request(app).post(url).set('x-access-token', token)
      .field({ title: 'Gif title' })
      .attach('image', fs.readFileSync(imgDir), 'Caterpillar.jpg')
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('status');
        expect(res.body).to.include.keys('data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.include.keys('message');
        expect(res.body.data).to.include.keys('gifId');
        expect(res.body.data).to.include.keys('title');
        expect(res.body.data).to.include.keys('secureUrl');
        expect(res.body.data).to.include.keys('createdOn');
        expect(res.body.data).to.include.keys('ownerId');
        expect(res.body.data.message).to.equal('Image successfully posted');
        expect(res.body.data.gifId).to.be.a('number');
        expect(res.body.data.secureUrl).to.be.a('string');
        done();
      });
  });
  it('Should return statusCode 400, Failed \'Title is required\'', (done) => {
    request(app).post(url).set('x-access-token', token)
      .field({ title: '' })
      .attach('image', fs.readFileSync(imgDir), 'Caterpillar.jpg')
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Title is required');
        done();
      });
  });
});
