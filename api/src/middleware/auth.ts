import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Request, Response, NextFunction } from 'express';

const userRepository = AppDataSource.getRepository(User);

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const unauthorized = () => res.status(401).end();
  if (!req.headers.authorization) return unauthorized()
  const token = req.headers.authorization.split(' ')[1];

  verify(token, config.TOKEN_SECRET, async (err: any, decoded: any) => {
    if (err) return unauthorized();
    try {
      const user = await userRepository.findBy({id: decoded.id});
      if (!user) return unauthorized();
      
      req.user = user;
      next();

    } catch (e) {
        console.log(e)
        unauthorized();
    }
  });
};

export default checkAuth;