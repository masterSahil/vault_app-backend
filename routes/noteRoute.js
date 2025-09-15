const express = require('express')
const router = express.Router();
const noteControll = require('../controller/noteController');

router.get('/note', noteControll.getNotes);
router.post('/note', noteControll.postNotes);
router.put('/note/:id', noteControll.putNotes);
router.delete('/note/:id', noteControll.deleteNotes);

module.exports = router;