/* eslint-disable linebreak-style */
const db = require('../../usingDB/db/db');
const date = require('../../usingDB/controllers/Date');

const Article = {
  /**
     * @param {object} req
     * @param {object} res
     * @param {object} article object
     *
     */
  // eslint-disable-next-line consistent-return
  async create(req, res) {
    const createdOn = date.generateDate();
    const modifiedOn = date.generateDate();
    const ownerId = req.user.id;

    const {
      title, article,
    } = req.body;
    const createQuery = `INSERT INTO feeds (title, feed, owner_id, createdOn, modifiedOn)
      VALUES($1, $2, $3, $4, $5) returning *`;
    const values = [title, article, ownerId, createdOn, modifiedOn];

    if (!title || !article) return res.status(400).json({ message: 'Please fill all fields' });

    try {
      const { rows } = await db.pool.query(createQuery, values);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Article successfully posted',
          articleId: rows[0].feed_id,
          title,
          article,
          createdOn,
        },
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get All Articles
   * @param {object} req
   * @param {object} res
   * @param {object} Article Array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM feeds Order BY createdOn DESC';
    try {
      const { rows } = await db.pool.query(findAllQuery);
      return res.status(200).send({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Article;
