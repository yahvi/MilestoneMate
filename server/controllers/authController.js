import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { mockDB } from '../utils/mockDB.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'milestonemate_default_jwt_secret_dev', {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, title, bio, paypalEmail } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role (freelancer or client).',
      });
    }

    if (!['freelancer', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "freelancer" or "client".',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        title: title || (role === 'freelancer' ? 'Full Stack Developer' : 'Project Sponsor'),
        bio: bio || '',
        paypalEmail: paypalEmail || email,
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          bio: user.bio,
          paypalEmail: user.paypalEmail,
        },
      });
    } else {
      // In-Memory Mode
      const existingUser = mockDB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        role,
        title: title || (role === 'freelancer' ? 'Full Stack Developer' : 'Project Sponsor'),
        bio: bio || '',
        paypalEmail: paypalEmail || email,
        createdAt: new Date(),
      };
      mockDB.users.push(newUser);

      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          title: newUser.title,
          bio: newUser.bio,
          paypalEmail: newUser.paypalEmail,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    let user;
    let isMatch = false;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    } else {
      user = mockDB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        paypalEmail: user.paypalEmail,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        title: req.user.title,
        bio: req.user.bio,
        paypalEmail: req.user.paypalEmail,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, title, bio, paypalEmail } = req.body;
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user._id);
      if (name) user.name = name;
      if (title !== undefined) user.title = title;
      if (bio !== undefined) user.bio = bio;
      if (paypalEmail !== undefined) user.paypalEmail = paypalEmail;
      await user.save();
    } else {
      user = mockDB.users.find(
        (u) => u._id === req.user._id || u._id.toString() === req.user._id.toString()
      );
      if (name) user.name = name;
      if (title !== undefined) user.title = title;
      if (bio !== undefined) user.bio = bio;
      if (paypalEmail !== undefined) user.paypalEmail = paypalEmail;
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        paypalEmail: user.paypalEmail,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      user.password = newPassword;
      await user.save();
    } else {
      const user = mockDB.users.find(
        (u) => u._id === req.user._id || u._id.toString() === req.user._id.toString()
      );
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};
