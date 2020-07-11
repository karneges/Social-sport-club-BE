import { Router } from 'express'
import { protect } from '../../../middleware/auth';
import {
    getAllActivities,
    getAthlete,
    getSummaryActivitiesFromDateAndFields,
    registerNewStravaUser
} from '../controllers/strava.users.controller';

const router = Router()

router.post('/', protect, registerNewStravaUser)
router.get('/athlete', protect, getAthlete)
router.get('/activities', protect, getAllActivities)
router.get('/activities/yearsummary', protect, getSummaryActivitiesFromDateAndFields)


export default router
