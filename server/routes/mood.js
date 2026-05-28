const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const controller = require('../controllers/moodController')

router.post('/checkin', auth, controller.checkin)
router.get('/entries', auth, controller.getEntries)
router.get('/insights', auth, controller.insights)
router.get('/timeline', auth, controller.timeline)
router.post('/generate', auth, controller.generateRecommendation)

module.exports = router
