/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
// eslint-disable-next-line linebreak-style
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const { Pool } = require('pg');
const dotenv = require('dotenv');

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
const createArticleTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS articles(
    article_id serial PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    article VARCHAR(510) NOT NULL,
    owner_id integer NOT NULL,
    createdOn TIMESTAMP,
    modifiedOn TIMESTAMP,
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
const dropArticleTable = () => {
  const queryText = 'DROP TABLE IF EXISTS articles';
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
  createUserTable, dropUserTable, createArticleTable, dropArticleTable, pool, connect, close,
};

require('make-runnable');
