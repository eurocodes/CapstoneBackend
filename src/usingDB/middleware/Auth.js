/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const database = require('../db/db');

const Auth = {
  /**
     * Verify Token
     * @param {object} req, res, next
     * @returns {object | void} response object
     */
  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({ message: 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE user_id = $1';
      const { rows } = await database.query(text, [decoded.user_id]);
      if (!rows[0]) {
        return res.status(400).send({ message: 'The token you provided is invalid' });
      }
      req.user = { id: decoded.user_id };
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = Auth;
