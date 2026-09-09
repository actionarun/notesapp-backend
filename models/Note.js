const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    summary: { type: String, trim: true, default: "" },
    content: { type: String, required: true }, // main "method"/body of the note
    image: { type: String, default: "" }, // cloudinary url
    imagePublicId: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Text index for search across title, subtitle, summary, content
noteSchema.index({ title: "text", subtitle: "text", summary: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);
