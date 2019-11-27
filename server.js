const app = require('./app');
const db = require('./src/usingDB/db/db');
const dotenv = require('dotenv');

dotenv.config();

PORT = process.env.PORT;

db.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log('Listening on port: ' + PORT);
    })
})