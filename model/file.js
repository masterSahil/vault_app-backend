const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
  filePath: { type: String, required: true },   // Supabase clean path
  fileUrl: { type: String },                    // refreshed signed URL
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("File", fileSchema);