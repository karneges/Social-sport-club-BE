import { Router } from 'express'
import { addPostToCLub, deletePost, editPost, getPosts } from "../controllers/post.controller";

const router = Router({ mergeParams: true })

router
    .get('/', getPosts)
    .post('/', addPostToCLub)
router
    .put('/:postId', editPost)
    .delete('/:postId', deletePost)


export default router

