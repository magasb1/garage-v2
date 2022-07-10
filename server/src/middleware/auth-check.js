import mongoose from 'mongoose';
import { verify } from 'jsonwebtoken';
import config from '../../config';

const checkAuth = (req, res, next) => {
  const unauthorized = () => res.status(401).end();

  if (!req.headers.authorization) {
    return unauthorized();
  }

  const token = req.headers.authorization.split(' ')[1];
  verify(token, config.jwtSecret, async (err, decoded) => {
    if (err) return unauthorized();
    
    try {
      const { username, exp } = decoded;
      if (exp < Date.now() / 1000) return unauthorized();
      const user = await mongoose.model('User').findOne({username});
      if (!user) return unauthorized();
      req.user = user;
      next();
    } catch (e) {
      unauthorized();
    }
  });
};

export default checkAuth;