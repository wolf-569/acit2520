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

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/auth/login",
//     failureMessage: true
//   })
// );

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    // console.log(`sessions: ${JSON.stringify(req.session)}`);

    if (!user) {
      // store message from strategy into session so GET /login can read it
      if (req.session) {
        req.session.messages = req.session.messages || [];
        if (info && typeof info.message === "string") {
          req.session.messages.push(info.message);
        }
      }
      return res.redirect("/auth/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      if (user.admin === true) return res.redirect("/admin/dashboard");
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});



router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

export default router;
