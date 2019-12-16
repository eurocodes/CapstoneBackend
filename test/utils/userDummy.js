/* eslint-disable linebreak-style */
const createUser = {
  validUser: {
    email: 'iamugee@yahoo.com',
    password: 'password1',
    firstName: 'Hilary',
    lastName: 'Ugo',
    department: 'IT',
    jobRole: 'Dev',
    isAdmin: false,
  },
  invalidEmail: {
    email: 'iamugeyahoo.com',
    password: 'password1',
    firstName: 'Ugo',
    lastName: 'Ugo',
    department: 'IT',
    jobRole: 'Dev',
    isAdmin: false,
  },
  missingValue: {
    email: '',
    password: '',
  },
};

const login = {
  validDetails: {
    email: 'iamugee@yahoo.com',
    password: 'password1',
  },
  invalidDetails: {
    email: 'iamugee@yahoo.com',
    password: 'dummypass',
  },
  missingValue: {
    email: '',
    password: '',
  },
};

module.exports = {
  createUser,
  login,
};
