import { Router } from 'express'
import { getAllUsers, getUser } from '../controllers/users.controller';
import { protect } from '../middleware/auth';

const router = Router()

router.get('/',protect, getAllUsers)
router.get('/:id', protect, getUser)



export default router

