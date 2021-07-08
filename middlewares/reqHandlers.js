const jwt = require("jsonwebtoken");
const path = require("path");
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
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "origin, content-type, accept"
      );

      if (!data.error) {
        const user = data.user;
        bcrypt.compare(password, user.password).then((pwdsComparingRes) => {
          if (pwdsComparingRes === true) {
            const accessToken = jwt.sign(
              {
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
              },
              ACCESS_TOKEN_SECRET
            );
            res.json({ accessToken, user });
          } else {
            res.json({ error: true, errorMessage: "wrong password" });
          }
        });
      } else {
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
  console.log(work);

  console.log("uploading");
  dbrequest("addWork", work)
    .then(() => {
      res.json({ success: true });
    })
    .catch((e) => {
      res.json({ error: e });
    });
};

const getUserWorks = (req, res) => {
  const { id } = req.params;
  dbrequest(`getWorks/${id}`)
    .then((r) => {
      res.json({ works: r });
    })
    .catch((e) => {
      res.json({ error: e });
    });
};

const getLessonWorks = (req, res) => {
  const { lessonName } = req.body;
  dbrequest(`getLessonWorks`, { lessonName })
    .then((r) => {
      res.json({ works: r });
    })
    .catch((e) => {
      res.json({ error: e });
    });
};

const getUserNotes = (req, res) => {
  const { id } = req.params;

  dbrequest(`getNotes/${id}`)
    .then((r) => {
      console.log(r);
      res.json({ notes: r });
    })
    .catch((e) => {
      res.json({ error: e });
    });
};

const addNote = (req, res) => {
  const currentNote = req.body;
  dbrequest(`addNote`, currentNote)
    .then((r) => {
      res.json({ notes: r });
    })
    .catch((e) => {
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

const getWork = (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, `../uploads/${id}`);
  res.download(filePath);
};

const updateRate = (req, res) => {
  dbrequest(`updateRate`, req.body)
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
  getLessonWorks,
  getUserNotes,
  addNote,
  removeNote,
  getWork,
  updateRate,
};
