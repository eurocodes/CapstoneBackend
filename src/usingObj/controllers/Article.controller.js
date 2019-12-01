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

    const {
      title, article, ownerId,
    } = req.body;
    console.log('My title: ', title, ownerId);
    // const ownerId = req.user.user_id;
    const createQuery = `INSERT INTO articles(title, article, owner_id, createdOn, modifiedOn)
      VALUES($1, $2, $3, $4, $5,) returning *`;
    const values = [title, article, ownerId, createdOn, modifiedOn];
    // console.log('values: ', values);

    try {
      const { rows } = await db.query(createQuery, values);
      // console.log('Print title: ', title);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Article successfully posted',
          articleId: rows[0],
          title,
          article,
          createdOn,
        },
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Article;
