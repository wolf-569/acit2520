import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import passportMiddleware from './middleware/passportMiddleware';
import passport from 'passport';
export {};

const port = process.env.port || 8000;

declare global {
  namespace Express {
    interface User {
      id: number;
      admin?: boolean;
      name?: string;
      email?: string;
      password?: string;
    }
  }
}

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.sessionID);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);
  next();
});


// const store = new session.MemoryStore();

// store.all((err, sessions) => {
//   console.log(sessions);
// });

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});


export default app;
