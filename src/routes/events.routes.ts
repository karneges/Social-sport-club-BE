import { Router } from 'express'
import { addEventToCLub, deleteEvent, editEvent, getEvents } from '../controllers/events.controller';
const router = Router({ mergeParams: true })

router
    .get('/', getEvents)
    .post('/', addEventToCLub)
router
    .put('/:eventId', editEvent)
    .delete('/:eventId', deleteEvent)


export default router

