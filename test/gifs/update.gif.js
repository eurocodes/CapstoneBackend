/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');

const app = require('../../app');

const imgDir = 'test/utils/image/Brochure.jpg';
const url = '/api/v1/images/modify/15';
const notExistUrl = '/api/v1/images/modify/2';

const userCredentials = {
  email: 'ugonna220@yahoo.com',
  password: 'password1',
};

describe('Test Update Image', () => {
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
  it('Should successfully update an Image by the owner given the :id', (done) => {
    request(app).put(url).set('x-access-token', token)
      .field({ title: 'Gif title updated' })
      .attach('image', fs.readFileSync(imgDir), 'Brochure.jpg')
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body).to.include.keys('image_id');
        expect(res.body).to.include.keys('title');
        expect(res.body).to.include.key('image_url');
        expect(res.body).to.include.key('owner_id');
        expect(res.body.owner_id).to.be.a('number');
        done();
      });
  });
  it('Should fail to update, \'Could not find image\'', (done) => {
    request(app).put(notExistUrl).set('x-access-token', token)
      .field({ title: 'Any title' })
      .attach('image', fs.readFileSync(imgDir), 'Brochure.jpg')
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('This image might have been deleted or does not exist');
        done();
      });
  });
});
