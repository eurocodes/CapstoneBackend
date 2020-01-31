/* eslint-disable linebreak-style */
const db = require('../../usingDB/db/db').pool;
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
      const { rows } = await db.query(createQuery, values);
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
   * Get All Items
   * @param {object} req
   * @param {object} res
   * @param {object} Item Array
   */
  async getAll(req, res) {
    const findAllQuery = `SELECT feed_id, title, feed, owner_id,createdon, modifiedon FROM feeds UNION
                          SELECT image_id, title, image_url, owner_id, createdon, modifiedon FROM images
                          ORDER BY createdon DESC`;
    try {
      const { rows } = await db.query(findAllQuery);
      return res.status(200).send({
        status: 'success',
        data: rows,
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
    const itemQuery = 'SELECT * FROM feeds WHERE feed_id = $1';
    const commentQuery = 'SELECT * FROM article_comments WHERE article_id = $1 ORDER BY createdon DESC';
    try {
      const { rows } = await db.query(itemQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Item not found' });
      }
      const comment = await db.query(commentQuery, [req.params.id]);
      return res.status(200).send({
        status: 'success',
        data: rows[0],
        comments: comment.rows,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Update an Article
   * @param {object} req
   * @param {object} res
   * @returns {object} updated Article
   */
  async modify(req, res) {
    // const findOneQuery = 'SELECT * FROM feeds WHERE feed_id = $1 and owner_id = $2';
    const findOneQuery = 'SELECT * FROM users INNER JOIN feeds ON users.user_id = $2 WHERE feeds.feed_id = $1';
    const modifyOneQuery = 'UPDATE feeds SET title = $1, feed = $2, modifiedOn = $3 WHERE feed_id = $4 returning *';
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (req.user.id !== rows[0].owner_id && rows[0].isadmin !== true) {
        return res.status(404).send({ message: 'Cannot find this article or you don\'t have permission to do this' });
      }
      const values = [
        req.body.title || rows[0].title,
        req.body.article || rows[0].feed,
        date.generateDate(),
        req.params.id,
        // req.user.id,
      ];
      const response = await db.query(modifyOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Delete Article
   * @param {object} req
   * @param {object} res
   * @param {void} return statusCode 204
   */
  async delete(req, res) {
    const findArticle = 'SELECT * FROM feeds WHERE feed_id = $1';
    const findOneQuery = 'SELECT * FROM users INNER JOIN feeds ON users.user_id = $2 WHERE feeds.feed_id = $1';
    const deleteQuery = 'DELETE FROM feeds WHERE feed_id = $1 returning *';
    try {
      const find = await db.query(findArticle, [req.params.id]);
      if (!find.rows[0]) {
        return res.status(404).send({ message: 'This article might have been deleted or does not exist' });
      }
      const data = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (req.user.id !== data.rows[0].owner_id && data.rows[0].isadmin !== true) {
        return res.status(404).send({ message: 'You don\'t have permission to do this' });
      }
      await db.query(deleteQuery, [req.params.id]);
      return res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Article;
