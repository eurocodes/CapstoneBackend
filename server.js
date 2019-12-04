/* eslint-disable linebreak-style */
const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const db = require('./src/usingDB/db/db');

dotenv.config();

// eslint-disable-next-line no-undef
const { PORT } = process.env || 5000;

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

db.connect()
  .then(() => {
    // eslint-disable-next-line no-undef
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port: ${PORT}`);
    });
  });
