const User = require('../models/user');

exports.addUser = async (req, res) => {
  const { name, email, phonenumber } = req.body;
  if (!name || !email || !phonenumber) {
    return res.status(400).json({ error: 'Name, email and phone number are required' });
  }
  try {
    const newUserDetail = await User.create({ name, email, phonenumber });
    console.log(`User added: ${newUserDetail.id}`);
    res.status(201).json({ newUserDetail });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'This email is already booked' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not add user' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ allUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    console.log(`User deleted: ${req.params.id}`);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete user' });
  }
};
