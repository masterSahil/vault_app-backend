const User = require('../model/user');
const bcrypt = require('bcrypt');

module.exports.signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email Already Exists",
            });
        }
        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            password: hashedPwd,
        });
        await newUser.save();

        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ success: false, message: "Email or Password is Wrong" });
        }
        res.status(200).json({
            success: true,
            message: "Logged in Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.loginWithMPIN = async (req, res) => {
    try {
        const { email, mpin } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        if (user.mpin === "" || user.mpin === null) {
            return res.status(400).json({ success: false, message: "You haven’t set up an MPIN yet."});
        }

        if (user.mpin != mpin) {
            console.log(user.mpin, mpin)
            return res.status(401).json({ success: false, message: "Wrong MPIN Entered"});
        }
        
        res.status(200).json({
            success: true,
            message: "Logged in Successfully",
        });

        console.log(res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.setMpin = async (req, res) => {
  try {
    const { email, old, mpin } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.mpin != old) {
        return res.status(400).json({ success: false, message: "Your old MPIN is incorrect."});
    }

    const setMpinUser = await User.findByIdAndUpdate(user._id, { mpin },
      { new: true });

    res.status(200).json({
      success: true,
      message: "MPIN set successfully",
      update: setMpinUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not Found" });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { fullname, email, oldEmail } = req.body;
    const user = await User.findOne({ email: oldEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not Found" });
    }

    const updatedUser = await User.findByIdAndUpdate( user._id,
      { fullname, email }, { new: true } );

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body; 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not Found" });
    }

    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      return res.status(400).json({ success: false, message: "Old Password is incorrect"});
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate( user._id,
      { password: hashedPwd }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};