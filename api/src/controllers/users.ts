import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import config from "../../config";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOneBy({
    username,
  });

  if (existingUser) {
    res.status(400).json({
      message: "Username already taken",
    });
  } else {
    const salt = await bcrypt.genSalt(config.SALT_ROUND);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      username,
      password: hashPassword,
      tokenVersion: 0,
    });

    await userRepository.save(user);

    res.status(200).json({ message: "User created" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({username});
  if (!user) {res.status(400).send({ message: "Invalid email or password" })}
  else {

    const isSuccess = await bcrypt.compare(password, user.password);
    if (!isSuccess)
    res.status(400).send({ message: "Invalid email or password" });
    const payload = {
      id: user.id,
      name: user.username,
    };
    const token = jwt.sign(payload, config.TOKEN_SECRET, {
      expiresIn: 3600,
    }); 
    res.status(200).send({ token });
  }
};

export const findAll = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const [users, count] = await userRepository.findAndCount()
    if (!users) res.status(500).send({ error: 'error' });
    res.status(200).json({ count, users });
};

export const findById = async (req: Request, res: Response) => {
    const { username } = req.body
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.findOneBy({username})
    if (!users) res.status(500).send({ error: 'error' });
    res.status(200).json({ users });
};
