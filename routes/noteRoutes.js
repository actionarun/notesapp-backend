const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect); // all note routes require login

router.route("/")
  .post(upload.single("image"), createNote)
  .get(getNotes);

router.route("/:id")
  .get(getNoteById)
  .put(upload.single("image"), updateNote)
  .delete(deleteNote);

module.exports = router;
