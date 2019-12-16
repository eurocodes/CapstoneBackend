/* eslint-disable linebreak-style */
require('dotenv').config();
const cloudinary = require('cloudinary');
const db = require('../../usingDB/db/db');
const date = require('../../usingDB/controllers/Date');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const Gif = {
  /**
     * @param {object} req
     * @param {object} res
     * @param {object} Gif/Image file
     */
  async postGif(req, res) {
    const file = req.files.image;
    if (!file) return res.status(400).json({ message: 'Image is required' });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const gifCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: 'files/images',
    });
    const { secure_url: secureUrl } = gifCloud;
    const createdOn = date.generateDate();
    const modifiedOn = date.generateDate();
    const ownerId = req.user.id;

    const creatQuery = 'INSERT INTO feeds (title, feed, owner_id, createdOn, modifiedOn) VALUES($1, $2, $3, $4, $5) returning *';
    const values = [title, secureUrl, ownerId, createdOn, modifiedOn];

    try {
      const { rows } = await db.pool.query(creatQuery, values);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Image successfully posted',
          gifId: rows[0].feed_id,
          title,
          secureUrl,
          createdOn,
          ownerId,
        },
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Gif;
