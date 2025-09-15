const express = require('express')
const router = express.Router();
const linkControll = require('../controller/linkcontroller');

router.get('/link', linkControll.gotLink);
router.post('/link', linkControll.postLink);
router.put('/link/:id', linkControll.putLink);
router.delete('/link/:id', linkControll.deleteLink);

module.exports = router;