const express = require('express');


const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { register, login, me, updateProfile, changePassword, uploadAvatar } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Ensure upload directory exists
const avatarsDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, avatarsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname) || '';
		cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`);
	}
});

const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);
router.post('/change-password', auth, changePassword);
router.post('/me/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;
