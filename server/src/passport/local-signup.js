import { Strategy as PassportLocalStrategy } from 'passport-local';

const getStrategy = (User) => new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, async (req, username, password, done) => {
  const newUser = new User({
    username: username.trim(),
    password: password.trim(),
  });

  try {
    await newUser.save();
    done(null);
  } catch (err) {
    console.error(err);
    done(err);
  }
});

export default getStrategy;