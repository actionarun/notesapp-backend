const Note = require("../models/Note");
const cloudinary = require("../config/cloudinary");

// @desc  Create note (with optional image)
// @route POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, subtitle, summary, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    let image = "", imagePublicId = "";
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: "notes-app/notes" });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const note = await Note.create({
      title,
      subtitle,
      summary,
      content,
      image,
      imagePublicId,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get notes (own notes for user, all notes for admin) + search + pagination
// @route GET /api/notes?search=&page=&limit=
const getNotes = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const notes = await Note.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Note.countDocuments(filter);

    res.json({
      success: true,
      notes,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single note
// @route GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("owner", "name email");
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (req.user.role !== "admin" && note.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update note (owner or admin only)
// @route PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (req.user.role !== "admin" && note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, subtitle, summary, content } = req.body;
    if (title !== undefined) note.title = title;
    if (subtitle !== undefined) note.subtitle = subtitle;
    if (summary !== undefined) note.summary = summary;
    if (content !== undefined) note.content = content;

    if (req.file) {
      if (note.imagePublicId) {
        await cloudinary.uploader.destroy(note.imagePublicId).catch(() => {});
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: "notes-app/notes" });
      note.image = result.secure_url;
      note.imagePublicId = result.public_id;
    }

    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete note (owner or admin only)
// @route DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (req.user.role !== "admin" && note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (note.imagePublicId) {
      await cloudinary.uploader.destroy(note.imagePublicId).catch(() => {});
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
