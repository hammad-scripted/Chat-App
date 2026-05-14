import bcrypt from 'bcrypt';
import { User } from './../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
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
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        success: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid password',
        success: false,
      });
    }
    generateToken(user._id, res);

    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Login Error:', error.message);

    return res.status(500).json({
      message: 'Something went wrong',
      success: false,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 0,
    });
    res.status(200).json({
      message: 'User logged out successfully',
      success: true,
    });
  } catch (error) {
    console.log('Logout Error:', error.message);
    return res.status(500).json({
      message: 'Something went wrong',
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({
        message: 'Profile pic is required',
        success: false,
      });
    }
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: 'Profile updated successfully',
      success: true,
    });
  } catch (error) {
    console.log('Update Profile Error:', error.message);

    return res.status(500).json({
      message: 'Something went wrong',
      success: false,
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong',
      success: false,
    });
  }
};
