const supabase = require("../config/supabaseClient");
const FileModel = require("../model/file");
const UserModel = require("../model/user");

// ✅ Get all files
module.exports.getFiles = async (req, res) => {
  try {
    const files = await FileModel.find().populate("userId", "email");

    // Generate signed URL dynamically
    const updatedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.filePath) {
          const { data: signedData, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .createSignedUrl(file.filePath, 3600); // 1 hour
          if (!error) file.fileUrl = signedData.signedUrl;
        }
        return file;
      })
    );

    res.status(200).json({ success: true, files: updatedFiles });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create new file
module.exports.createFile = async (req, res) => {
  try {
    const file = req.file;
    const { title, description, email } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const filePath = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (uploadError) throw uploadError;

    const newFile = new FileModel({
      filePath,      // only path stored
      fileUrl: null, // generate signed URL dynamically later
      title,
      description,
      userId: user._id,
    });

    await newFile.save();
    res.status(201).json({ success: true, file: newFile });
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update file + metadata
module.exports.updateFile = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = await FileModel.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // If a new file uploaded
    if (req.file) {
      // Delete old file from Supabase
      if (file.filePath) {
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([file.filePath]);
      }

      const newPath = `${Date.now()}-${req.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(newPath, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
      if (uploadError) throw uploadError;

      file.filePath = newPath;
      file.fileUrl = null; // signed URL will be generated on fetch
    }

    if (title) file.title = title;
    if (description) file.description = description;

    await file.save();
    res.json({ success: true, file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete file
module.exports.deleteFile = async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (!file.filePath) return res.status(400).json({ message: "No filePath stored in DB" });

    console.log("🟢 File exists in Supabase, attempting delete:", file.filePath);

    // Delete from Supabase
    const { data: deleteData, error: deleteError } = await supabase
      .storage
      .from("uploads")
      .remove([file.filePath]);

    if (deleteError) {
      console.error("❌ Supabase delete error:", deleteError.message);
      return res.status(500).json({ message: deleteError.message });
    } else {
      console.log("✅ Supabase delete response:", deleteData);
    }

    // Confirm deletion via list
    const { data: afterList } = await supabase.storage.from("uploads").list("", { limit: 100 });
    console.log("📂 Files remaining in bucket after delete:", afterList.map(f => f.name));

    // Delete from MongoDB
    await FileModel.findByIdAndDelete(req.params.id);
    console.log("✅ File deleted from MongoDB as well");

    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("🔥 Unexpected error in deleteFile:", err.message);
    res.status(500).json({ message: err.message });
  }
};