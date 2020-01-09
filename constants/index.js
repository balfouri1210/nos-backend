module.exports = {
  defaultServerResponse: {
    status: 400,
    message: 'server error!',
    body: {}
  },

  errors: {
    // Related to User
    EMAIL_ALREADY_EXISTS: {
      code: 'u001',
      message: 'EMAIL_ALREADY_EXISTS'
    },
    USER_NOT_FOUND: {
      code: 'u002',
      message: 'USER_NOT_FOUND'
    },
    INVALID_PASSWORD: {
      code: 'u003',
      message: 'INVALID_PASSWORD'
    },

    INVALID_VERIFICATION_CODE: {
      code: 'u004',
      message: 'INVALID_VERIFICATION_CODE'
    },
    ALREADY_ACTIVATED_USER: {
      code: 'u005',
      message: 'ALREADY_ACTIVATED_USER'
    },

    USER_NOT_ACTIVATED: {
      code: 'u006',
      message: 'USER_NOT_ACTIVATED'
    },

    // Related to Authentication
    TOKEN_MISSING: {
      code: 'a001',
      message: 'TOKEN_MISSING'
    },

    // Related to Email
    EMAIL_FAILED_SIGNUP: {
      code: 'e001',
      message: 'EMAIL_FAILED_SIGNUP'
    },

    // Related to Comment
    GET_COMMENT_FAILED: {
      code: 'c001',
      message: 'GET_COMMENT_FAILED'
    },
    CREATE_COMMENT_FAILED: {
      code: 'c002',
      message: 'CREATE_COMMENT_FAILED'
    }
  }
};
