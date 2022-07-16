import { Strategy } from "passport-local";
import * as bcrypt from "bcryptjs";
import { createAccessToken } from "../../lib/auth";
import { User } from "../../entity/User";
import { Repository } from "typeorm";

const local = (userRepository: Repository<User>) =>
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await userRepository.findOneBy({ username });
        if (!user) return done({ code: "INCORRECT_CREDENTIALS" });
        const isSuccess = await bcrypt.compare(password, user.password);
        if (!isSuccess) return done({ code: "INCORRECT_CREDENTIALS" });

        /* @ts-ignore */
        return done(null, user, createAccessToken(user));
      } catch (e) {
        console.error(e);
        done({code: 'FORM_SUBMISSION_FAILED', info: e});
      }
    }
  );

export default local;
