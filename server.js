/* eslint-disable linebreak-style */
const dotenv = require('dotenv');
const app = require('./app');
const db = require('./src/usingDB/db/db');

dotenv.config();

// eslint-disable-next-line no-undef
PORT = process.env.PORT;

db.connect()
  .then(() => {
    // eslint-disable-next-line no-undef
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-undef
      console.log(`Listening on port: ${PORT}`);
    });
  });
