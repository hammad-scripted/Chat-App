import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, //Ms 7days
    });
    return token;
  } catch (error) {
    console.error(error);
  }
};
