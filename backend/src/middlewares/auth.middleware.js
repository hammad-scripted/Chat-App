import { jwt } from 'jsonwebtoken';
import { User } from '../models/user.model.js';

import { cookieParser } from 'cookie-parser';
export const protectRoute = async (req, res, next) => {
  //* first approach if we use bearer token
  //   let token;
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith('Bearer')
  //   ) {
  //     try {
  //       token = req.headers.authorization.split(' ')[1];
  //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //       req.user = await User.findById(decoded.userId).select('-password');
  //       next();
  //     } catch (error) {
  //       console.log(error);
  //       res.status(401).json({ message: 'Not authorized' });
  //     }
  //   }
  //   if (!token) {
  //     res.status(401).json({ message: 'Not authorized' });
  //   }

  try {
    const token = res.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Not authorized', success: false });
  }
};
