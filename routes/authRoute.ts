import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import 'express-session';

const router = express.Router();

declare module 'express-session' {
  interface SessionData {
    messages?: string[];
  }
}


router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = (req.session && req.session.messages) ? req.session.messages : [];
  if (req.session) req.session.messages = [];
  res.render("login", { messages });
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
