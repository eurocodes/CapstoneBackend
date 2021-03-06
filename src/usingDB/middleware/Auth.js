/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const database = require('../db/db').pool;

const Auth = {
  /**
     * Verify Token
     * @param {object} req, res, next
     * @returns {object | void} response object
     */
  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    // const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE user_id = $1';
      const { rows } = await database.query(text, [decoded.user_id]);
      if (!rows[0]) {
        return res.status(401).send({ message: 'Not permitted' });
      }
      req.user = { id: decoded.user_id };
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Auth;
