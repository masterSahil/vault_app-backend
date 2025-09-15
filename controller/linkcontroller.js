const LinkSchema = require("../model/link")
const UserSchema = require("../model/user")

module.exports.gotLink = async (req, res) => {
    try {
        const fetched = await LinkSchema.find();

        res.status(200).json({
            success: true,
            link: fetched,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.postLink = async (req, res) => {
    try {
        const {title, url, email} = req.body;

        const user = await UserSchema.findOne({email});
        
        const newLink = new LinkSchema({title, url, userId: user._id});

        await newLink.save();

        res.status(201).json({
            success: true,
            link: newLink,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.putLink = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, url} = req.body;
        const updated = await LinkSchema.findByIdAndUpdate(id, {title, url}, {new: true});

        res.status(200).json({
            success: true,
            link: updated,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.deleteLink = async (req, res) => {
    try {
        const {id} = req.params;
        const remove = await LinkSchema.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            link: remove,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}