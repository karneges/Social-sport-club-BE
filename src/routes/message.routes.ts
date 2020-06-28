import { Router } from 'express'
import { getMessages } from '../controllers/messages.controller';
import { protect } from '../middleware/auth';

const router = Router()

router.get('/:userId',protect, getMessages)

export default router

