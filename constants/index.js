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
    },

    INVALID_VERIFICATION_CODE: {
      code: 'u004',
      message: 'Invalid verification code'
    },
    ALREADY_ACTIVATED_USER: {
      code: 'u005',
      message: 'Already activated user'
    },

    USER_NOT_ACTIVATED: {
      code: 'u006',
      message: 'User not activated'
    }
  }
};
