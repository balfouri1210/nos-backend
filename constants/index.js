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

    // Related to Opinion
    UPDATE_OPINION_VOTE_FAILED: {
      code: 'o001',
      message: 'UPDATE_OPINION_VOTE_FAILED'
    },
    GET_VOTED_OPINION_FAILED: {
      code: 'o002',
      message: 'GET_VOTED_OPINION_FAILED'
    },

    // Related to Comment
    GET_COMMENT_FAILED: {
      code: 'c001',
      message: 'GET_COMMENT_FAILED'
    },
    CREATE_COMMENT_FAILED: {
      code: 'c002',
      message: 'CREATE_COMMENT_FAILED'
    },
    EDIT_COMMENT_FAILED: {
      code: 'c003',
      message: 'EDIT_COMMENT_FAILED'
    },
    DELETE_COMMENT_FAILED: {
      code: 'c004',
      message: 'DELETE_COMMENT_FAILED'
    },

    // Related to Vote
    GET_VOTE_HISTORIES_FAILED: {
      code: 'v001',
      message: 'GET_VOTE_HISTORIES_FAILED'
    },
    REGISTER_VOTE_HISTORY_FAILED: {
      code: 'v002',
      message: 'REGISTER_VOTE_HISTORY_FAILED'
    },

    // Related to Notification
    ADD_NOTIFICATION_FAILED: {
      code: 'n001',
      message: 'ADD_NOTIFICATION_FAILED'
    },
    GET_NOTIFICATION_FAILED: {
      code: 'n002',
      messagE: 'GET_NOTIFICATION_FAILED'
    }
  }
};
