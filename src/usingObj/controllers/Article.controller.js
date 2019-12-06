/* eslint-disable linebreak-style */
const db = require('../../usingDB/db/db');

const Article = {
  /**
     * @param {object} req
     * @param {object} res
     * @param {object} article object
     *
     */
  // eslint-disable-next-line consistent-return
  async create(req, res) {
    const today = new Date();
    const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${+today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const dateTime = `${date} ${time}`;
    const createdOn = dateTime;
    const modifiedOn = dateTime;
    const ownerId = req.user.id;

    const {
      title, article,
    } = req.body;
    const createQuery = `INSERT INTO articles (title, article, owner_id, createdOn, modifiedOn)
      VALUES($1, $2, $3, $4, $5) returning *`;
    const values = [title, article, ownerId, createdOn, modifiedOn];

    try {
      const { rows } = await db.pool.query(createQuery, values);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Article successfully posted',
          articleId: rows[0].article_id,
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
    const findAllQuery = 'SELECT * FROM articles Order BY createdOn DESC';
    try {
      const { rows } = await db.pool.query(findAllQuery);
      return res.status(200).send({
        status: 'success',
        data: rows
      })
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Article;
