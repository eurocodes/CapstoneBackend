/* eslint-disable linebreak-style */
require('dotenv').config();
const cloudinary = require('cloudinary');
const db = require('../../usingDB/db/db').pool;
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
    const { secure_url: secureUrl, public_id: publicId } = gifCloud;
    const createdOn = date.generateDate();
    const modifiedOn = date.generateDate();
    const ownerId = req.user.id;

    const creatQuery = 'INSERT INTO images (title, image_url, owner_id, createdOn, modifiedOn, publicId) VALUES($1, $2, $3, $4, $5, $6) returning *';
    const values = [title, secureUrl, ownerId, createdOn, modifiedOn, publicId];

    try {
      const { rows } = await db.query(creatQuery, values);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Image successfully posted',
          gifId: rows[0].image_id,
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

  /**
   * Get a Single Item
   * @param {object} req
   * @param {object} res
   * @param {object} Item
   */
  async getOneItem(req, res) {
    const itemQuery = 'SELECT * FROM images WHERE image_id = $1';
    const commentQuery = 'SELECT * FROM image_comments WHERE image_id = $1 ORDER BY createdon DESC';
    try {
      const { rows } = await db.query(itemQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Item not found' });
      }
      const comment = await db.query(commentQuery, [req.params.id]);
      return res.status(200).send({
        data: rows[0],
        comments: comment.rows,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Update Gif
   * @param {object} req
   * @param {object} res
   * @returns {object} updated Article
   */
  async modify(req, res) {
    const file = req.files.image;
    // const findOneQuery = 'SELECT * FROM feeds WHERE feed_id = $1 and owner_id = $2';
    const findOneQuery = 'SELECT * FROM users INNER JOIN images ON users.user_id = $2 WHERE images.image_id = $1';
    const modifyOneQuery = 'UPDATE images SET title = $1, image_url = $2, modifiedOn = $3, publicId = $4 WHERE image_id = $5 returning *';

    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (req.user.id !== rows[0].owner_id && rows[0].isadmin !== true) {
        return res.status(404).send({ message: 'Cannot find this article or you don\'t have permission to do this' });
      }
      const gifCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: 'files/images',
      });
      const { secure_url: secureUrl, public_id: publicId } = gifCloud;
      const modifiedOn = date.generateDate();
      const values = [
        req.body.title || rows[0].title,
        secureUrl || rows[0].image_url,
        modifiedOn,
        publicId,
        req.params.id,
      ];
      const response = await db.query(modifyOneQuery, values);
      await cloudinary.v2.uploader.destroy(rows[0].publicid);
      return res.status(200).send(response.rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Delete Gif
   * @param {object} req
   * @param {object} res
   * @param {void} return statusCode 204
   */
  async delete(req, res) {
    const findImage = 'SELECT * FROM images WHERE image_id = $1';
    const findOneQuery = 'SELECT * FROM users INNER JOIN images ON users.user_id = $2 WHERE images.image_id = $1';
    const deleteQuery = 'DELETE FROM images WHERE image_id = $1 returning *';
    try {
      const find = await db.query(findImage, [req.params.id]);
      if (!find.rows[0]) {
        return res.status(404).send({ message: 'This image might have been deleted or does not exist' });
      }
      const data = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (req.user.id !== data.rows[0].owner_id && data.rows[0].isadmin !== true) {
        return res.status(404).send({ message: 'You don\'t have permission to do this' });
      }
      await db.query(deleteQuery, [req.params.id]);
      await cloudinary.v2.uploader.destroy(data.rows[0].publicid);
      return res.status(200).send({ message: 'Image deleted successfully' });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Gif;
