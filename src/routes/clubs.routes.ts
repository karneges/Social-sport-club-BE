import { Router } from 'express'
import { addPostToCLub, getClub, getClubs, getPosts } from "../controllers/clubs.controllers";
import advancedResults from "../middleware/advancedQuery";
import Club from '../models/club'

const router = Router()

router.get('/', advancedResults(Club, ['owner']), getClubs)
router.get('/:id', getClub)
router.get('/:id/posts', getPosts)
router.post('/:id/post', addPostToCLub)


export default router

