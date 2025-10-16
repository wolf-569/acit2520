import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById, getUserEmail, checkUserPassword} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { Express } from "express";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);
    const userEmail = getUserEmail(email);
    if (!userEmail) {
      return done(null, false, { message: "Email not registered" });
    }
    const correctPassword = checkUserPassword(email, password);
    if (!correctPassword) {
      return done(null, false, { message: "Incorrect password: Have you considered bruteforcing?" });
    }
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    return done(null, user);
  }
);

passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  done(null, user.id);
});


passport.deserializeUser(function (id: Express.User["id"], done: (err: any, user?: Express.User) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, undefined);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
