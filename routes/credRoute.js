const express = require('express')
const router = express.Router();
const credControll = require('../controller/credController');

router.get('/creds', credControll.getCreds);
router.post('/creds', credControll.postCreds);
router.put('/creds/:id', credControll.putCreds);
router.delete('/creds/:id', credControll.deleteCreds);

module.exports = router;