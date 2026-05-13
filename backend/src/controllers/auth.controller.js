import bcrypt from 'bcrypt';
import { User } from './../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check required fields
  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
      success: false,
    });
  }

  try {
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
        success: false,
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        success: false,
      });
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Generate JWT token & cookie
    generateToken(newUser._id, res);

    // Response
    return res.status(201).json({
      message: 'User created successfully',
      success: true,
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log('Signup Error:', error.message);

    return res.status(500).json({
      message: 'Something went wrong',
      success: false,
    });
  }
};
export const login = (req, res) => {
  res.send('login');
};
export const logout = (req, res) => {
  res.send('logout');
};
