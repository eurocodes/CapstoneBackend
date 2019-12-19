/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
// eslint-disable-next-line linebreak-style
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const { Pool } = require('pg');
const dotenv = require('dotenv');

const { validUser } = require('../../../test/utils/userDummy').createUser;

dotenv.config();

const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

// eslint-disable-next-line consistent-return
const connect = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    // eslint-disable-next-line no-undef
    die(error);
  }
};

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users(
    user_id serial PRIMARY KEY,
    isAdmin boolean NOT NULL,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    gender VARCHAR(10),
    jobRole VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    createdOn TIMESTAMP,
    modifiedOn TIMESTAMP
    )`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((error) => {
      console.log(error);
      pool.end();
    });
};

/**
 * Create Article Table
 */
const createFeedTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS feeds(
    feed_id serial PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    feed VARCHAR(510) NOT NULL,
    owner_id integer NOT NULL,
    createdOn TIMESTAMP with time zone,
    modifiedOn TIMESTAMP with time zone,
    FOREIGN KEY (owner_id) REFERENCES users (user_id) ON DELETE CASCADE
  )`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((error) => {
      console.log(error);
      pool.end();
    });
};
const deleteRow = () => {
  const queryText = `DELETE FROM users WHERE email LIKE ${validUser.email}`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((error) => {
      console.log(error);
      pool.end();
    });
};

/**
 * Drop Table Users
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((error) => {
      console.log(error);
      pool.end();
    });
};

/**
 * Drop Table Articles
 */
const dropFeedTable = () => {
  const queryText = 'DROP TABLE IF EXISTS feeds';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((error) => {
      console.log(error);
      pool.end();
    });
};

function close() {
  return pool.end();
}

module.exports = {
  createUserTable, dropUserTable, createFeedTable, dropFeedTable, pool, connect, close, deleteRow,
};

require('make-runnable');
