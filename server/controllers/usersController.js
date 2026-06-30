const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ThrowError } = require('../middleware/errorHandler');
const usersService = require('../services/usersService');
const prisma = require('../prisma/client');

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

const getAllUsersController = async (req, res, next) => {
    try {
      const users = await usersService.getAllUser();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
}

const getUserController = async (req, res, next) => {
    try {
      const id  = parseInt(req.params.id);
      const user = await usersService.getUser(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
}

const updateUserController = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { username, email, bio } = req.body
    try {
      const user = await usersService.updateUser(id, username, email, bio);
      const updatedUser = await usersService.getUser(user.id);
      res.status(200).json({ message: 'User updated successfully', user: updatedUser })
    } catch (error) {
      next(error);
    }
}

const signupController = async (req, res, next) => {
  const { username, email, password, bio, profile_picture } = req.body;
  try {
    const existingUser = await usersService.getUserByEmail(email);

    if (existingUser) {
      throw new ThrowError(400, `User with email ${email} already exists`);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersService.createUser(username, email, hashedPassword, bio, profile_picture)
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error)
  }
}

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findUser = await usersService.getUserByEmail(email);

    if (!findUser) {
      throw new ThrowError(404, 'User not found');
    }

    const passwordMatched = await bcrypt.compare(password, findUser.password);

    if (!passwordMatched) {
      throw new ThrowError(400, 'Password mismatch');
    }

    const token = jwt.sign({ id: findUser.id, email: findUser.email }, SECRET_KEY, { expiresIn: '1h' })

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000, sameSite: 'None' });

    res.status(200).json({ message: 'Login successful', user: { id: findUser.id, email: findUser.email } });
  } catch (error) {
    next(error)
  }
}

const checkAuth = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, bio: true }
    });
    if (!user) {
      return res.json({ isAuthenticated: false });
    }
    return res.json({ isAuthenticated: true, user });
  } catch {
    return res.json({ isAuthenticated: false });
  }
}

const logout = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
 
  res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = {
    getAllUsersController,
    getUserController,
    updateUserController,
    signupController,
    loginController,
    checkAuth,
    logout
}