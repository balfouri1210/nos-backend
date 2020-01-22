const pool = require('../database/db-connection');
const axios = require('axios');
const { errors } = require('../constants/index');

async function signupEmailRequester (email, verificationCode) {
  try {
    await axios.post(
      `${process.env.EMAIL_SENDER_URL}/signup`,
      { email, verificationCode }
    );
  } catch (err) {
    throw new Error(errors.EMAIL_FAILED_SIGNUP.message);
  }
}

module.exports.sendSignupEmail = async (email, verificationCode) => {
  await signupEmailRequester(email, verificationCode);
};

module.exports.sendSignupEmailAgain = async ({ email }) => {
  try {
    const [user] = (await pool.query(`SELECT * FROM users WHERE email='${email}'`))[0];

    if (user) {
      await signupEmailRequester(email, user.verification_code);
    } else {
      throw new Error(errors.USER_NOT_FOUND.message);
    }
  } catch (err) {
    throw new Error(errors.EMAIL_FAILED_SIGNUP.message);
  }
};
