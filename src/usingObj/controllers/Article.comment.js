/* eslint-disable linebreak-style */
const db = require('../../usingDB/db/db').pool;
const date = require('../../usingDB/controllers/Date');

const Comment = {
  /**
     * @param {object} req
     * @param {object} res
     * @param {object} comment object
     */
  async create(req, res) {
    const createdOn = date.generateDate();
    const modifiedOn = date.generateDate();
    const commentBy = req.user.id;
    const articleId = req.params.id;
    const { comment } = req.body;
    const itemQuery = 'SELECT * FROM feeds WHERE feed_id = $1';
    const insertQuery = `INSERT INTO article_comments (comment, article_id, comment_by, createdOn, modifiedOn)
    VALUES($1, $2, $3, $4, $5) returning *`;
    const values = [comment, articleId, commentBy, createdOn, modifiedOn];
    try {
      const item = await db.query(itemQuery, [articleId]);
      if (!item.rows[0]) {
        return res.status(404).send({ message: 'Cannot be found' });
      }
      const { rows } = await db.query(insertQuery, values);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'Comment successfully posted',
          comment_id: rows[0].comment_id,
          comment,
          commentBy,
          createdOn,
        },
      });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },

  /**
   * Get All comments for an Article
   * @param {object} req
   * @param {object} res
   * @param {object} Item
   */
  async getAllComments(req, res) {
    const itemQuery = 'SELECT * FROM article_comments WHERE article_id = $1 ORDER BY createdon DESC';
    try {
      const { rows } = await db.query(itemQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Article not found' });
      }
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Delete Article Comment
   * @param {object} req
   * @param {object} res
   * @param {void} return statusCode 204
   */
  async delete(req, res) {
    const lookUpQuery = 'SELECT * FROM article_comments WHERE comment_id = $1';
    const findOneQuery = 'SELECT * FROM users INNER JOIN article_comments ON users.user_id = $2 WHERE article_comments.comment_id = $1';
    const deleteQuery = 'DELETE FROM article_comments WHERE comment_id = $1 returning *';
    try {
      const { rows } = await db.query(lookUpQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Cannot be found' });
      }
      const data = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (req.user.id !== data.rows[0].comment_by && data.rows[0].isadmin !== true) {
        return res.status(401).send({ message: 'You don\'t have permission to do this' });
      }
      await db.query(deleteQuery, [req.params.id]);
      return res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Comment;
