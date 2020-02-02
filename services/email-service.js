const pool = require('../database/db-connection');
const axios = require('axios');
const { errors } = require('../constants/index');
const { generateNewVerificationCode} = require('./auth-service');

// Fired when user signup
// This function need email parameter because there is no JWT yet
module.exports.sendSignupEmail = async (email, verificationCode) => {
  try {
    await signupEmailRequester(email, verificationCode);
    return;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || errors.EMAIL_FAILED_SIGNUP.message);
  }
};

// Fired when user want to RESEND signup email
module.exports.sendSignupEmailAgain = async ({ email }) => {
  try {
    const [user] = (await pool.query(`SELECT * FROM users WHERE email='${email}'`))[0];

    if (user) {
      await signupEmailRequester(email, user.verification_code);
    } else {
      throw new Error(errors.USER_NOT_FOUND.message);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || errors.EMAIL_FAILED_SIGNUP.message);
  }
};

// Fired when user need to verified by volatile verification code
module.exports.sendVerificationEmail = async (email, volatileVerificationCode) => {
  try {
    await axios.post(
      `${process.env.EMAIL_SENDER_URL}/verification`,
      {
        email,
        volatileVerificationCode,
        stage: process.env.stage
      }
    );
    return;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || errors.EMAIL_FAILED_VERIFICATION.message);
  }
};

// Fired when user want to reset password
module.exports.sendPwdResetEmail = async ({ email }) => {
  try {
    const [user] = (await pool.query(`SELECT * FROM users WHERE email='${email}'`))[0];

    if (user) {
      const newVerificationCode = generateNewVerificationCode();
      const [updateResult] = await pool.query(`
        UPDATE users SET verification_code='${newVerificationCode}'
        WHERE email='${email}'
      `);

      if (!updateResult)
        throw new Error(errors.UPDATE_USER_FAILED.message);

      await axios.post(
        `${process.env.EMAIL_SENDER_URL}/password-reset`,
        {
          email,
          verificationCode: newVerificationCode,
          stage: process.env.stage
        }
      );
    } else {
      throw new Error(errors.USER_NOT_FOUND.message);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || errors.EMAIL_FAILED_PASSWORD_RESET.message);
  }
};


// Mail Requesters
async function signupEmailRequester (email, verificationCode) {
  try {
    await axios.post(
      `${process.env.EMAIL_SENDER_URL}/signup`,
      {
        email,
        verificationCode,
        stage: process.env.stage
      }
    );
    return;
  } catch (err) {
    throw new Error(errors.EMAIL_FAILED_SIGNUP.message);
  }
}
