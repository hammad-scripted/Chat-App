import express from 'express';
import { getUsersForSidebar } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessages } from '../controllers/message.controller.js';
import { sendMessages } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/messages/users', protectRoute, getUsersForSidebar);
router.get('/messages/:id', protectRoute, getMessages);
router.post('/messages/send/:id', protectRoute, sendMessages);
export default router;
