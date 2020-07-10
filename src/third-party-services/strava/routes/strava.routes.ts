import { Router } from 'express'
import { protect } from '../../../middleware/auth';
import { getActivities, getAthlete, registerNewStravaUser } from '../controllers/strava.users.controller';

const router = Router()

router.post('/', protect, registerNewStravaUser)
router.get('/athlete', protect, getAthlete)
router.post('/activities', protect, getActivities)


export default router
