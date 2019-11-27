const database = require('../db/db').pool;
const Helper = require('./Helper');

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
                'message': 'Some values are missing'
            });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({
                'message': 'Please enter a valid email address'
            })
        }
        const hashPassword = Helper.hashPassword(req.body.password);
        
        const today = new Date();
        const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${+today.getDate()}`;
        const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        const dateTime = `${date} ${time}`;
        const createdOn = dateTime;
        const modifiedOn = dateTime;

        const { isAdmin, firstName, lastName, email, gender, jobRole, department, address } = req.body;


        try {
            const { rows } = await database.query(`INSERT INTO users (isAdmin, firstName, lastName, email, password, gender, jobRole, department, address, createdOn, modifiedOn)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
        [isAdmin, firstName, lastName, email, hashPassword, gender, jobRole, department, address, createdOn, modifiedOn]);
        const userid = rows[0].userid;
        const token = Helper.generateToken(userid);
        return res.status(201).send({
            'status': 'success',
            'data': {
                'message': 'User account successfully created',
                'token': token,
                'userid': userid
            }
        });
        } catch(error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({
                    'status': 'error',
                    'error': 'Email address already exist'
                })
            }
            return res.status(400).send(error);
        }
    }

}

module.exports = User;