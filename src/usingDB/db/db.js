const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
}); 

const connect = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    die(error);
  }
}

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users(
    userid serial PRIMARY KEY,
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
 * Drop Table Users
 */
const dropUserTable = () => {
  const queryText = `DROP TABLE IF EXISTS users`;
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
 * Create All Tables
 */

const createAllTables = () => {
  createUserTable();
};

/**
  * Drop All Tables
  */
const dropAllTables = () => {
  dropUserTable();
};

function close() {
  return pool.end()
}

module.exports = {
  createAllTables, dropAllTables, createUserTable, dropUserTable, pool, connect, close
};

require('make-runnable');
