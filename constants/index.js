module.exports = {
  constants: {
    weeklyPlayerHistoryRange: 100,
    defaultMinId: 2147483647,
    hotCommentVoteCriteria: 5 // hot comment로 분류되는 추천 수 기준
  },

  defaultServerResponse: {
    status: 400,
    message: 'server error!',
    body: {}
  },

  playerScoreSqlGenerator(target) {
    return `
      ROUND(${target}.hits/2)
      + ${target}.comment_count
      + ${target}.vote_up_count
      + ${target}.vote_down_count
      + ${target}.vote_question_count
      + ${target}.vote_fire_count
      + ${target}.vote_celebration_count
      + ${target}.vote_strong_count
      + ${target}.vote_alien_count
      + ${target}.vote_battery_high_count
      + ${target}.vote_battery_medium_count
      + ${target}.vote_battery_low_count
      + ${target}.vote_battery_off_count
      + ${target}.vote_bomb_count
      + ${target}.vote_angry_count
      + ${target}.vote_hmm_count
      + ${target}.vote_cool_count
      + ${target}.vote_sad_count
      + ${target}.vote_lol_count
      + ${target}.vote_poop_count
    `;
  },

  errors: {
    // Related to origin
    // 원하지 않는 origin에서 들어온 요청일 경우 (like postman)
    NOW_ALLOWED_ORIGIN: {
      code: 'not_allowed_origin',
      message: 'NOT_ALLOWED_ORIGIN'
    },


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
    INVALID_FORM_CONTENT: {
      code: 'u014',
      message: 'INVALID_FORM_CONTENT'
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
    // ALREADY_VOTED_PLAYER: {
    //   code: 'p010',
    //   message: 'ALREADY_VOTED_PLAYER'
    // },
    UPDATE_PLAYER_FAILED: {
      code: 'p011',
      message: 'UPDATE_PLAYER_FAILED'
    },
    CREATE_PLAYER_FAILED: {
      code: 'p012',
      message: 'CREATE_PLAYER_FAILED'
    },
    DELETE_PLAYER_FAILED: {
      code: 'p013',
      message: 'DELETE_PLAYER_FAILED'
    },
    GET_TOTAL_PLAYER_COUNT_FAILED: {
      code: 'p014',
      message: 'GET_TOTAL_PLAYER_COUNT_FAILED'
    },
    MUTATE_PLAYER_COMMENT_COUNT_FAILED: {
      code: 'p015',
      message: 'MUTATE_PLAYER_COMMENT_COUNT_FAILED'
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
    NO_COMMENT_CONTENT: {
      code: 'c006',
      message: 'NO_COMMENT_CONTENT'
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
    UPDATE_VOTE_HISTORY_FAILED: {
      code: 'v004',
      message: 'UPDATE_VOTE_HISTORY_FAILED'
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
    GET_LATEST_HISTORY_ID_FAILED: {
      code: 'h005',
      message: 'GET_LATEST_HISTORY_ID_FAILED'
    },


    // Related to Report
    // r001, r002.. 는 reply가 사용중
    CREATE_REPORT_FAIL: {
      code: 're001',
      message: 'CREATE_REPORT_FAIL'
    },


    // Related to Search
    SEARCH_PLAYER_FAILED: {
      code: 's001',
      message: 'SEARCH_PLAYER_FAILED'
    },


    // Related to Club
    GET_CLUBS_FAILED: {
      code: 'club001',
      message: 'GET_CLUBS_FAILED'
    },

    UPDATE_CLUB_FAILED: {
      code: 'club002',
      message: 'UPDATE_CLUB_FAILED'
    },

    GET_CLUB_STANDINGS_FAILED: {
      code: 'club003',
      message: 'GET_CLUB_STANDINGS_FAILED'
    }
  }
};
