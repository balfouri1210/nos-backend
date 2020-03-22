module.exports = {
  constants: {
    weeklyPlayerHistoryRange: 100
  },

  defaultServerResponse: {
    status: 400,
    message: 'server error!',
    body: {}
  },

  errors: {
    // Related to User
    UNAVAILABLE_EMAIL: {
      code: 'u001',
      message: 'UNAVAILABLE_EMAIL'
    },
    UNAVAILABLE_USERNAME: {
      code: 'u002',
      message: 'UNAVAILABLE_EMAIL'
    },
    USER_NOT_FOUND: {
      code: 'u003',
      message: 'USER_NOT_FOUND'
    },
    INVALID_PASSWORD: {
      code: 'u004',
      message: 'INVALID_PASSWORD'
    },
    SIGNUP_FAILED: {
      code: 'u005',
      message: 'SIGNUP_FAILED'
    },
    UPDATE_USER_FAILED: {
      code: 'u006',
      message: 'UPDATE_USER_FAILED'
    },
    ACTIVATION_USER_FAILED: {
      code: 'u007',
      message: 'ACTIVATION_USER_FAILED'
    },
    LESS_THAN_THIRTY_DAYS: {
      code: 'u008',
      message: 'LESS_THAN_THIRTY_DAYS'
    },

    INVALID_VERIFICATION_CODE: {
      code: 'u009',
      message: 'INVALID_VERIFICATION_CODE'
    },
    ALREADY_ACTIVATED_USER: {
      code: 'u010',
      message: 'ALREADY_ACTIVATED_USER'
    },

    USER_NOT_ACTIVATED: {
      code: 'u011',
      message: 'USER_NOT_ACTIVATED'
    },
    GENERATE_VOLATILE_VER_CODE_FAILED: {
      code: 'u012',
      message: 'GENERATE_VOLATILE_VER_CODE_FAILED'
    },
    DELETE_USER_FAILED: {
      code: 'u013',
      message: 'DELETE_USER_FAILED'
    },

    // Related to Player
    GET_PLAYERS_FAILED: {
      code: 'p001',
      message: 'GET_PLAYERS_FAILED'
    },
    GET_PLAYER_BY_ID_FAILED: {
      code: 'p002',
      message: 'GET_PLAYER_BY_ID_FAILED'
    },
    INCREASE_PLAYER_HITS_FAILED: {
      code: 'p003',
      message: 'INCREASE_PLAYER_HITS_FAILED'
    },
    VOTE_PLAYER_FAILED: {
      code: 'p004',
      message: 'VOTE_PLAYER_FAILED'
    },
    GET_VOTED_PLAYER_FAILED: {
      code: 'p005',
      message: 'GET_VOTED_PLAYER_FAILED'
    },
    CANCEL_VOTE_PLAYER_FAILED: {
      code: 'p006',
      message: 'CANCEL_VOTE_PLAYER_FAILED'
    },
    GET_PLAYER_SCORE_FAILED: {
      code: 'p007',
      message: 'GET_PLAYER_SCORE_FAILED'
    },
    SET_PLAYER_DEGREES_FAILED: {
      code: 'p008',
      message: 'SET_PLAYER_DEGREES_FAILED'
    },
    COOL_DOWN_PREVIOUS_TOP_PLAYER_FAILED: {
      code: 'p009',
      message: 'COOL_DOWN_PREVIOUS_TOP_PLAYER_FAILED'
    },
    ALREADY_VOTED_PLAYER: {
      code: 'p010',
      message: 'ALREADY_VOTED_PLAYER'
    },

    // Related to Authentication
    TOKEN_MISSING: {
      code: 'a001',
      message: 'TOKEN_MISSING'
    },
    INVALID_TOKEN: {
      code: 'a002',
      message: 'INVALID_TOKEN'
    },

    // Related to Email
    EMAIL_FAILED_SIGNUP: {
      code: 'e001',
      message: 'EMAIL_FAILED_SIGNUP'
    },
    EMAIL_FAILED_VERIFICATION: {
      code: 'e002',
      message: 'EMAIL_FAILED_VERIFICATION'
    },
    EMAIL_FAILED_PASSWORD_RESET: {
      code: 'e003',
      message: 'EMAIL_FAILED_PASSWORD_RESET'
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
    ALREADY_VOTED_OPINION: {
      code: 'o003',
      message: 'ALREADY_VOTED_OPINION'
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
    GET_COMMENT_COUNT_FAILED: {
      code: 'c005',
      message: 'GET_COMMENT_COUNT_FAILED'
    },

    // Related to Reply
    GET_REPLY_FAILED: {
      code: 'r001',
      message: 'GET_REPLY_FAILED'
    },
    CREATE_REPLY_FAILED: {
      code: 'r002',
      message: 'CREATE_REPLY_FAILED'
    },
    EDIT_REPLY_FAILED: {
      code: 'r003',
      message: 'EDIT_REPLY_FAILED'
    },
    DELETE_REPLY_FAILED: {
      code: 'r004',
      message: 'DELETE_REPLY_FAILED'
    },

    // Related to Vote history
    GET_VOTE_HISTORIES_FAILED: {
      code: 'v001',
      message: 'GET_VOTE_HISTORIES_FAILED'
    },
    REGISTER_VOTE_HISTORY_FAILED: {
      code: 'v002',
      message: 'REGISTER_VOTE_HISTORY_FAILED'
    },
    DELETE_VOTE_HISTORY_FAILED: {
      code: 'v003',
      message: 'DELETE_VOTE_HISTORY_FAILED'
    },

    // Related to Notification
    ADD_NOTIFICATION_FAILED: {
      code: 'n001',
      message: 'ADD_NOTIFICATION_FAILED'
    },
    GET_NOTIFICATION_FAILED: {
      code: 'n002',
      messagE: 'GET_NOTIFICATION_FAILED'
    },

    // Related to History
    REGISTER_HISTORY_FAILED: {
      code: 'h001',
      message: 'REGISTER_HISTORY_FAILED'
    },
    GET_HISTORIES_FAILED: {
      code: 'h002',
      message: 'GET_HISTORIES_FAILED'
    },
    GET_COMMENTS_HISTORIES_FAILED: {
      code: 'h003',
      message: 'GET_COMMENTS_HISTORIES_FAILED'
    },
    GET_REPLIES_HISTORIES_FAILED: {
      code: 'h004',
      message: 'GET_REPLIES_HISTORIES_FAILED'
    },

    // Related to Report
    // r001, r002.. 는 reply가 사용중
    CREATE_REPORT_FAIL: {
      code: 're001',
      message: 'CREATE_REPORT_FAIL'
    }
  }
};
