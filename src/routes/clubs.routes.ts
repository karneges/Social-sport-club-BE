import { Router } from 'express'
import { getClubs } from "../controllers/clubs.controllers";

const router = Router()

router.get('/',getClubs)


export default router
