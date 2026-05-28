const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }, token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'avatar'] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error('Me error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateProfile(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
    }
    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    await user.save();
    return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error('UpdateProfile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function uploadAvatar(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    console.log('uploadAvatar: req.user=', req.user, 'file=', req.file && req.file.filename)
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // try by id, fallback to email
    let user = null
    if (req.user.id) user = await User.findByPk(req.user.id)
    if (!user && req.user.email) user = await User.findOne({ where: { email: req.user.email } })
    if (!user) return res.status(404).json({ message: 'User not found' });
    // store path relative to /uploads
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();
    console.log('uploadAvatar: saved avatar for user', user.id, avatarPath)
    return res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error('UploadAvatar error', err);
    return res.status(500).json({ message: (err && err.message) || 'Server error' });
  }
}

async function changePassword(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords required' });
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('ChangePassword error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, me, updateProfile, changePassword, uploadAvatar };

