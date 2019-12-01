/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let connectionString = '';

if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST_DATABASE_URL;
} else {
  connectionString = process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString,
});


// function connect() {
//   return new Promise((resolve, reject) => {
//     pool.connect()
//     .then((res, error) => {
//       if (error) return reject(error);
//       resolve();
//     })
//   });
// }

// eslint-disable-next-line consistent-return
const connect = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    die(error);
  }
};

function close() {
  return pool.end();
}

module.exports = { connect, close, pool };
