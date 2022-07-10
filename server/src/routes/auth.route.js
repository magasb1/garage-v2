import { Router } from "express";
import passport from "passport";
import config from '../../config'
import { sign, verify } from 'jsonwebtoken';
import cookie from 'cookie';
import mongoose, { now } from "mongoose";
import UserSchema from '../models/schemas/user'

const User = mongoose.model('User', UserSchema);
const router = new Router();

function createAccessToken (user) {
  return sign({ username: user.username }, config.jwtSecret, {
    expiresIn: "1m",
  });
};

function createRefreshToken (user, version) {
  return sign({ username: user.username, version }, config.refreshSecret, {
    expiresIn: "30d",
  });
};

function sendRefreshToken (res, token) {
  res.cookie("refreshToken", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
};


/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignUpForm(payload) {
  const errors = validateBasicSignInSignUpForm(payload);

  if (
    !payload ||
    typeof payload.username !== "string" ||
    !/^[a-zA-Z]+([\-\s]?[a-zA-Z]+)*$/.test(payload.username.trim())
  ) {
    errors.username = {
      code: "INVALID_USERNAME",
    };
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 8
  ) {
    errors.password = {
      code: "INVALID_PASSWORD",
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

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length === 0
  ) {
    errors.password = {
      code: "EMPTY_PASSWORD",
    };
  }

  return errors;
}

function validateBasicSignInSignUpForm(payload) {
  const errors = {};

  if (
    !payload ||
    typeof payload.username !== "string" ||
    payload.username.trim().length === 0
  ) {
    errors.username = {
      code: "INVALID_USERNAME",
    };
  }

  return errors;
}

router.post("/signup", (req, res, next) => {
  const validationErrors = validateSignUpForm(req.body);

  if (Object.keys(validationErrors).length > 0) {
    return res.json({ errors: validationErrors });
  }

  return passport.authenticate("local-signup", (err) => {
    if (err) {
      const { field, code } =
        err.name === "MongoError" && err.code === 11000
          ? { field: "username", code: "DUPLICATED_USERNAME" }
          : { field: "", code: "FORM_SUBMISSION_FAILED" };

      return res.json({
        errors: { [field]: { code } },
      });
    }

    return res.json({});
  })(req, res, next);
});

router.post("/signin", (req, res, next) => {
  const validationErrors = validateSignInForm(req.body);

  if (Object.keys(validationErrors).length > 0) {
    return res.json({ errors: validationErrors });
  }

  return passport.authenticate("local-login", (error, user, token) => {
    if (error !== null) {
      return res.json({
        errors: {
          [error.code === "INCORRECT_CREDENTIALS" ? "password" : ""]: error,
        },
      });
    }
    sendRefreshToken(res, createRefreshToken(user));
    return res.json({
      payload: {
        token,
        user
      },
    });
  })(req, res, next);
});

router.post("/refresh-token", async (req, res, next) => {
  let payload = null
  if (!req.headers.cookie)
  return res.status(200).json({ ok: false, payload });
  
  const getToken = cookie.parse(req.headers.cookie)
  const token = getToken.refreshToken
  if(!token) return res.send({ok: false, payload})

  try {
    const content = verify(token, config.refreshSecret)
    if (content.exp < new Date() / 1000) return res.json({ok:false, payload})
    const user = await User.findOne({ username: content.username.trim() });
    if (!user) return res.send({ok: false, payload})
    sendRefreshToken(res, createRefreshToken(user));
    const accessToken = createAccessToken(user)
    return res.json({
      ok: true,
      payload: {
        token: accessToken,
        user: user,
      },
    });
  } catch (e) {
    console.log(e)
    return res.send({ok: false, payload })
  }
        
});

module.exports = router;
