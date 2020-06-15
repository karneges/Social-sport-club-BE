import { Router } from 'express'
import { getClub, getClubs } from "../controllers/clubs.controller";
import postRotes from './post.routes'
import eventRotes from './events.routes'
import advancedResults from "../middleware/advancedQuery";
import Club from '../models/club'
import event from '../models/event';

const router = Router()

// Include other resource routers
router.use('/:id/posts', postRotes)
router.use('/:id/events', eventRotes)

router.get('/', advancedResults(Club, ['owner']), getClubs)
router.get('/:id', getClub)


export default router

