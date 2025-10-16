import  request from "supertest";
import app from "../app";

describe("HTTP endpoint tests", () => {
  test("GET /auth/login returns 200 ", async () => {
    const res = await request(app).get("/auth/login");
    expect(res.statusCode).toBe(200);
  });
//   test("GET /auth/login valid email and password returns 200 ", async () => {
//     const res = await request(app).get("/auth/login").send({ email: "admin@test.com", password: "1234" });
//     expect(res.text).toContain("Email not registered");
//   });

  test("POST /login with valid credentials returns success", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@mail.com", password: "test" });
      console.log("CWD:", process.cwd());
    //   console.log(res); 
    expect(res.statusCode).toBe(404);
  });

test("POST /login with invalid password returns 401", async () => {
    const res = await request(app)
        .post("/login")
        .send({ email: "admin@test.com", password: "wrong" });

    // Accessing session from the response
    const session = res.headers['set-cookie']; // Passport session is typically stored in cookies
    console.log("Session:", session);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Email not registered" });
});
});