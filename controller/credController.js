const CredsSchema = require('../model/creds');
const userSchema = require('../model/user');

module.exports.getCreds = async(req, res) => {
    try {
        const fetched = await CredsSchema.find();

        res.status(200).json({
            success: true,
            cred: fetched,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.postCreds = async(req, res) => {
    try {
        const {site, username, userEmail, password, email} = req.body;

        const user = await userSchema.findOne({email});
        const newCred = new CredsSchema({site, username, userEmail, password, userId: user._id});

        await newCred.save();

        res.status(201).json({
            success: true,
            cred: newCred,
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.putCreds = async(req, res) => {
    try {
        const {id} = req.params;
        const {site, username, userEmail, password} = req.body;

        const updateCred = await CredsSchema.findByIdAndUpdate(id, 
            {site, username, userEmail, password}, {new: true});

        res.status(200).json({
            success: true,
            cred: updateCred,
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.deleteCreds = async(req, res) => {
    try {
        const {id} = req.params;
        const removed = await CredsSchema.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            cred: removed,
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}