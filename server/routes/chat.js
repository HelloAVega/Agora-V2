const express = require('express')
const auth = require('../middleware/auth')
const { getThread, sendMessage } = require('../controllers/chatController')

const router = express.Router()

router.get('/thread', auth, getThread)
router.post('/message', auth, sendMessage)

module.exports = router