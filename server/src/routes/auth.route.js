import { Router } from 'express';
import passport from 'passport';

const router = new Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignUpForm(payload) {
  const errors = validateBasicSignInSignUpForm(payload);

  if (!payload || (typeof payload.username !== 'string') || !/^[a-zA-Z]+([\-\s]?[a-zA-Z]+)*$/.test(payload.username.trim())) {
    errors.username = {
      code: 'INVALID_USERNAME'
    };
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    errors.password = {
      code: 'INVALID_PASSWORD'
    };
  }

  return errors;
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignInForm(payload) {
  const errors = validateBasicSignInSignUpForm(payload);

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    errors.password = {
      code: 'EMPTY_PASSWORD'
    };
  }

  return errors;
}

function validateBasicSignInSignUpForm(payload) {
  const errors = {};

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    errors.username = {
      code: 'INVALID_USERNAME'
    };
  }

  return errors;
}

router.post('/signup', (req, res, next) => {
  const validationErrors = validateSignUpForm(req.body);

  if (Object.keys(validationErrors).length > 0) {
    return res.json({ errors: validationErrors });
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      const { field, code } = err.name === 'MongoError' && err.code === 11000
          ? { field: 'username', code: 'DUPLICATED_USERNAME' }
          : { field: '', code: 'FORM_SUBMISSION_FAILED' };

      return res.json({
        errors: { [field]: { code } }
      });
    }

    return res.json({});
  })(req, res, next);
});

router.post('/signin', (req, res, next) => {
  const validationErrors = validateSignInForm(req.body);

  if (Object.keys(validationErrors).length > 0) {
    return res.json({ errors: validationErrors });
  }

  return passport.authenticate('local-login', (error, token, user) => {
    if (error !== null) {
      return res.json({
        errors: {
          [error.code === 'INCORRECT_CREDENTIALS' ? 'password' : '']: error
        }
      });
    }

    return res.json({
      payload: {
        token,
        user,
      },
    });
  })(req, res, next);
});

module.exports = router;