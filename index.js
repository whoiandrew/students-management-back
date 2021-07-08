const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  register,
  login,
  uploadWork,
  getUserWorks,
  getUserNotes,
  addNote,
  removeNote,
  getLessonWorks,
  getWork,
  updateRate,
} = require("./middlewares/reqHandlers");

const { authenticateJWT } = require("./middlewares/authMW");

const PORT = "8080";

const app = express();
const upload = multer({ dest: __dirname + "/uploads/" });

//middlewares
app.use(express.json());
app.use(cors());

//routing
app.post("/register", register);
app.post("/login", login);
app.post("/uploadWork", authenticateJWT, upload.single("file"), uploadWork);
app.get("/getWorks/:id", getUserWorks);
app.get("/getNotes/:id", getUserNotes);
app.post("/addNote", addNote);
app.get("/removeNote/:id", removeNote);
app.post("/getLessonWorks", getLessonWorks);
app.get("/getWork/:id", getWork);
app.post("/updateRate", updateRate);

app.listen(PORT, () => {
  console.log(`Listening on port :${PORT}...`);
});
