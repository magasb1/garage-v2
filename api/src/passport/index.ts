import passport from "passport";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

import local from "./strategy/local";
const userRepository = AppDataSource.getRepository(User);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (username: string, done) => {
  try {
    const user = await userRepository.findOneBy({ username });
    if (!user) throw new Error("User does not exist");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use("local", local(userRepository));

export default passport;
