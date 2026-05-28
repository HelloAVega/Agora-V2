const express = require('express')
const auth = require('../middleware/auth')
const { getThread, getSessions, createSession, sendMessage } = require('../controllers/chatController')

const router = express.Router()

router.get('/sessions', auth, getSessions)
router.post('/sessions', auth, createSession)
router.get('/thread', auth, getThread)
router.post('/message', auth, sendMessage)

module.exports = router