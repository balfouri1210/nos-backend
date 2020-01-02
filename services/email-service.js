const axios = require('axios');

module.exports.sendSignupEmail = async (email, verificationCode) => {
  try {
    await axios.post(
      'https://email-sender.907degrees.com/signup',
      { email, verificationCode }
    );
  } catch (err) {
    throw new Error(err);
  }
};
