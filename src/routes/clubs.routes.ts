import { Router } from 'express'
import { addPostToCLub, deletePost, editPost, getClub, getClubs, getPosts } from "../controllers/clubs.controller";
import advancedResults from "../middleware/advancedQuery";
import Club from '../models/club'

const router = Router()

router.get('/', advancedResults(Club, ['owner']), getClubs)
router.get('/:id', getClub)
router
    .get('/:id/posts', getPosts)
    .post('/:id/posts', addPostToCLub)
router
    .put('/:id/posts/:postId', editPost)
    .delete('/:id/posts/:postId', deletePost)


export default router

