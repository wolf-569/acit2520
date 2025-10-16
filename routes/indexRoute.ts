import express from "express";
const router = express.Router();
import { ensureAuthenticated, ensureAdmin } from "../middleware/checkAuth";
import sessionStore from "express-session";
import { json } from "stream/consumers";

type SessionData = {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    path: string;
  };
  passport: {
    user: string | number;
  };
};

type ParsedSessions = Record<string, SessionData>;

type SessionInfo = {
  sessionId: string;
  userId: string | number;
};

router.get("/", (req, res) => {
  res.send("welcome");
});


router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
  console.log(req.sessionID);
}); 


router.get("/admin/dashboard", ensureAdmin, (req, res) =>{
  res.render("admindashboard", { user: req.user });
})


router.get("/admin/sessions", ensureAdmin, (req, res) => {
  // ! Retrieve all active sessions
  req.sessionStore.all((err: any, sessions: any) => {
    if (err) return res.status(500).send("Error retrieving sessions");
    const parsed: ParsedSessions = sessions;
    console.log(parsed);

const sessionArray: SessionInfo[] = Object.entries(parsed).map(
  ([sessionId, sessionData]) => ({
    sessionId,
    userId: sessionData.passport.user,
  })
);
res.render("admin-sessions", { sessions: sessionArray });
// console.log(sessionArray);
  });
});

router.post("/admin/revoke-session/:sessionId", ensureAdmin, (req, res) => {
  const { sessionId } = req.params;
  if (req.user?.id && (req.session as any).passport.user === sessionId) {
    if (req.session) req.session.messages = ["You cannot delete your own session."];
    return res.redirect("/admin/sessions");
  }

  req.sessionStore.destroy(sessionId, (err: any) => {
    if (err) return res.status(500).send("Error deleting session");
    console.log(`Session ${sessionId} deleted by admin`);
    res.redirect("/admin/sessions");
  });
});

export default router;
