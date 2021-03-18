const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const fs = require("fs");
const { DB_MS_PORT, DB_MS_URL, ACCESS_TOKEN_SECRET } = require("../constants");
const dbrequest = require("../dbrequest");

const login = (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  if (!username || !password) {
    res.json({ errorMessage: "empty login field/fields" });
  }

  fetch(`${DB_MS_URL}:${DB_MS_PORT}/getUser/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "origin, content-type, accept"
      );

      if (!data.error) {
        const user = data.user;

        console.log(password, user.password);
        bcrypt.compare(password, user.password).then((pwdsComparingRes) => {
          if (pwdsComparingRes === true) {
            console.log("passwrods matched");
            const accessToken = jwt.sign(
              { username: user.username, role: user.role },
              ACCESS_TOKEN_SECRET
            );
            res.json({ accessToken, user });
          } else {
            res.json({ error: true, errorMessage: "wrong password" });
          }
        });
      } else {
        console.log(data);
        res.json(data);
      }
    })
    .catch((error) => {
      res.json({ success: false, errorMessage: error.message });
    });
};

const register = (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      fetch(`${DB_MS_URL}:${DB_MS_PORT}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, hash }),
      }).then((r) => {
        res.sendStatus(r.status);
      });
    })
    .catch((e) => console.log(e));
};

const uploadWork = (req, res) => {
  const { lesson, author } = req.body;
  const work = { ...req.file, lesson, author };

  console.log("uploading");
  dbrequest("addWork", work)
    .then((r) => {
      console.log("work has uploaded successfuly");
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });
};

const getUserWorks = (req, res) => {
  const { id } = req.params;
  console.log("get works for " + id);
  dbrequest(`getWorks/${id}`)
    .then((r) => {
      console.log("got works of" + id);
      console.log(r);
      res.json({ works: r });
    })
    .catch((e) => {
      console.log(e);
      res.json({ error: e });
    });
};

const getUserNotes = (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log("get notes for " + id);
  dbrequest(`getNotes/${id}`)
    .then((r) => {
      console.log(r);
      res.json({ notes: r });
    })
    .catch((e) => {
      console.log(e);
      res.json({ error: e });
    });
};

const addNote = (req, res) => {
  const currentNote = req.body;
  dbrequest(`addNote`, currentNote)
    .then((r) => {
      console.log(r);
      res.json({ notes: r });
    })
    .catch((e) => {
      console.log(e);
      res.json({ error: e });
    });
};

const removeNote = (req, res) => {
  const { id } = req.params;
  dbrequest(`removeNote/${id}`)
    .then((r) => {
      res.json(r);
    })
    .catch((err) => res.json({ error: err }));
};

module.exports = {
  login,
  register,
  uploadWork,
  getUserWorks,
  getUserNotes,
  addNote,
  removeNote,
};
