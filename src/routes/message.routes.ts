import { Router } from 'express'
import { getMessages, getNoReadMessagesFromUser } from '../controllers/messages.controller';
import { protect } from '../middleware/auth';

const router = Router()

router.get('/noread',protect, getNoReadMessagesFromUser)
router.get('/:userId',protect, getMessages)

export default router

