import express from 'express';
import {
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/login', login);

router.post('/logout', logout);

router.post('/signup', signup);
router.put('/update-profilePic', protectRoute, updateProfile);
export default router;
