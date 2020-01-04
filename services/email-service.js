const pool = require('../database/db-connection');
const axios = require('axios');
const { errors } = require('../constants/index');

async function signupEmailRequester (email, verificationCode) {
  try {
    await axios.post(
      'https://email-sender.907degrees.com/signup',
      { email, verificationCode }
    );
  } catch (err) {
    throw new Error({
      code: errors.EMAIL_FAILED_SIGNUP.code,
      message: errors.EMAIL_FAILED_SIGNUP.message
    });
  }
}

module.exports.sendSignupEmail = async (email, verificationCode) => {
  await signupEmailRequester(email, verificationCode);
};

module.exports.sendSignupEmailAgain = async (email) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
    const user = rows[0];

    if (user) {
      await signupEmailRequester(email, user.verificationCode);
    } else {
      throw new Error({
        code: errors.USER_NOT_FOUND.code,
        message: errors.USER_NOT_FOUND.message
      });
    }
  } catch (err) {
    throw new Error({
      code: errors.USER_NOT_FOUND.code,
      message: errors.USER_NOT_FOUND.message
    });
  }
};
