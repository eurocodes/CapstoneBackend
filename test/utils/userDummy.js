/* eslint-disable linebreak-style */
const createUser = {
  validUser: {
<<<<<<< HEAD

    email: 'iamugee@outlook.com',
=======
    email: 'iamugee@yahoo.com',

=======
    email: 'iamugoo@outlook.com',
>>>>>>> cf28276... Enabled modification to Articles and Images and Added comments to All posts
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
