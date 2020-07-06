import { Router } from 'express'
import {
    getMessages,
    getNoReadMessagesFromUser,
    markAsReadMessages
} from '../controllers/messages/messages.controller';
import { protect } from '../middleware/auth';

const router = Router()

router.get('/noread', protect, getNoReadMessagesFromUser)
router.get('/:userId', protect, getMessages)
router.get('/markasread/:userId', protect, markAsReadMessages)
export default router

