const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const users = require("./users");
const books = require("./books");

const PORT = "8080";
const ACCESS_TOKEN_SECRET = "secretvalue";

const app = express();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

app.use(express.json());
app.use(cors());

app.get("/books", authenticateJWT, (req, res) => {
  console.log(books);
  res.json(books);
});

app.post("/register",(req, res) => {
  
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log("requested");

  const user = users.find((u) => {
    return u.password === password && u.username === username;
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "origin, content-type, accept"
  );

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET
    );

      console.log(accessToken); 
    res.json({ accessToken });
  } else {
    res.json({errorMessage: "Invalid data"});
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port :${PORT}...`);
});
