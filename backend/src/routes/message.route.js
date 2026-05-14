import express from 'express';
import Message from '../models/message.model';
const router = express.Router();

router.get('/users', getUsersForSidebar);
export default router;
