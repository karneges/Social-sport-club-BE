import { Router } from 'express'
import { getAllUsers, getUser } from '../controllers/users.controller';
import { protect } from '../middleware/auth';
import { getMessages } from '../controllers/messages.controller';

const router = Router()

router.get('/message', getMessages)
router.get('/', getAllUsers)
router.get('/:id', protect, getUser)



export default router

