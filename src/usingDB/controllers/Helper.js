const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Helper = {
    /**
     * Hash Password Method
     * @param {string} Password
     * @returns {string} returns hashed password
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    },
    /**
     * Compare Password
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} returns true or false
     */
    comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword);
    },
    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} true or false
     */
    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    },
    /**
     * Generate Token
     * @param {string} id
     * @param {string} token
     */
    generateToken(id) {
        const token = jwt.sign({
            userid: id
        },
        process.env.SECRET, { expiresIn: '7d' }
        );
        return token;
    }
}


module.exports = Helper;