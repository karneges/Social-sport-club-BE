import { Router } from 'express'
import { protect } from '../../../middleware/auth';
import {
    getActivitiesTrainValuesByDayRange,
    getAllActivities, getAllUserActivities,
    getAthlete,
    getSummaryActivitiesFromDateAndFieldsBySportType, getSummaryActivitiesFromDateAndFieldsFromFileds,
    registerNewStravaUser, removeStravaUser
} from '../controllers/strava.users.controller';

const router = Router()

router.post('/', protect, registerNewStravaUser)
router.delete('/', protect, removeStravaUser)
router.get('/athlete', protect, getAthlete)
router.get('/activities', protect, getAllActivities)
router.put('/activities-by-sport-type', protect, getSummaryActivitiesFromDateAndFieldsBySportType)
router.put('/activities-by-train-values', protect, getSummaryActivitiesFromDateAndFieldsFromFileds)
router.put('/activities-by-train-values/days', protect, getActivitiesTrainValuesByDayRange)




router.get('/activities-all', protect, getAllUserActivities)

export default router
