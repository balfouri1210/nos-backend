module.exports = {
  defaultServerResponse: {
    message: '',
    body: {}
  },

  errors: {
    EMAIL_ALREADY_EXISTS: {
      code: 'u001',
      message: 'This email already exists'
    },
    USER_NOT_FOUND: {
      code: 'u002',
      message: 'User not found'
    },
    INVALID_PASSWORD: {
      code: 'u003',
      message: 'Invalid password'
    }
  }
};
