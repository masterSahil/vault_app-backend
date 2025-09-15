const noteSchema = require('../model/notes')
const userSchema = require('../model/user')

module.exports.getNotes = async (req, res) => {
    try {
        const fetch = await noteSchema.find();

        res.status(200).json({
            success: true,
            note: fetch,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.postNotes = async (req, res) => {
    try {
        const {title, note, email} = req.body;
        const user = await userSchema.findOne({email});

        const newNote = new noteSchema({title, note, userId: user._id});
        await newNote.save();

        res.status(200).json({
            success: true,
            note: newNote,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.putNotes = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, note} = req.body;

        const updatedNote = await noteSchema.findByIdAndUpdate(id, {title, note}, {new: true});

        res.status(200).json({
            success: true,
            note: updatedNote,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.deleteNotes = async (req, res) => {
    try {
        const {id} = req.params;
        const remove = await noteSchema.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            note: remove,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}