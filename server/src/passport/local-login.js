import { sign } from 'jsonwebtoken';
import { Strategy as PassportLocalStrategy } from 'passport-local';

import config from '../../config'

function createAccessToken (user) {
  return sign({ username: user.username }, config.jwtSecret, {
    expiresIn: "1m",
  });
};

const getStrategy = (User) => new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return done({code: 'INCORRECT_CREDENTIALS'});
    }

    const matched = await user.comparePassword(password.trim());

    if (!matched) {
      return done({code: 'INCORRECT_CREDENTIALS'});
    }

    done(null, user, createAccessToken(user));
  } catch (e) {
    console.error(e);
    done({code: 'FORM_SUBMISSION_FAILED', info: e});
  }
});

export default getStrategy;