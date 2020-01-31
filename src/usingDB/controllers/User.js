/* eslint-disable linebreak-style */
const database = require('../db/db').pool;
const Helper = require('./Helper');
const date = require('./Date');

const User = {
  /**
     * Create New User
     * @param {object} req
     * @param {object} res
     * @param {object} article object
     */
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: 'Some values are missing',
      });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: 'Please enter a valid email address',
      });
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createdOn = date.generateDate();
    const modifiedOn = date.generateDate();

    const {
      isAdmin, firstName, lastName, email, gender, jobRole, department, address,
    } = req.body;


    try {
      const findUserQuery = 'SELECT * FROM users WHERE user_id = $1';
      const user = await database.query(findUserQuery, [req.user.id]);
      if (user.rows[0].isadmin !== true) {
        return res.status(400).send({ message: 'Not permitted' });
      }
      const { rows } = await database.query(`INSERT INTO users (isAdmin, firstName, lastName, email, password, gender, jobRole, department, address, createdOn, modifiedOn)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
      [isAdmin, firstName, lastName, email, hashPassword, gender, jobRole,
        department, address, createdOn, modifiedOn]);
      const userid = rows[0].user_id;
      const token = Helper.generateToken(userid);
      return res.status(201).send({
        status: 'success',
        data: {
          message: 'User account successfully created',
          token,
          userid,
        },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({
          status: 'error',
          error: 'Email address already exist',
        });
      }
      return res.status(400).send(error);
    }
  },

  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Some values are missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await database.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({ message: 'The credentials you provided is incorrect' });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ message: 'The credentials you provided is incorrect' });
      }
      const userid = rows[0].user_id;
      const token = Helper.generateToken(userid);
      return res.status(200).send({
        status: 'success',
        data: {
          token,
          userid,
        },
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error,
      });
    }
  },

};

module.exports = User;
