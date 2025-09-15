const express = require('express');
const router = express.Router();
const userControll = require('../controller/userControll')

router.post('/findUser', userControll.findUser);
router.put('/updateUser', userControll.updateUser);
router.put('/updatePassword', userControll.updatePassword);
router.post('/signup', userControll.signup);
router.post('/login', userControll.login);
router.post('/login-mpin', userControll.loginWithMPIN);
router.put('/set-mpin', userControll.setMpin);

module.exports = router;