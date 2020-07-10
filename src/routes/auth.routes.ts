import { Router } from 'express'
import { getMe, getNewAccessToken, login, register } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router()

router.post('/register', register)
router.put('/login', login)
router.get('/me', protect, getMe)
router.get('/token',protect, getNewAccessToken)


export default router

