import express from 'express'
import { ContactService } from '../service/ContactService'

export const contactRoute = express.Router()

const contactService = new ContactService()

contactRoute.get('/contacts', contactService.viewContact)
contactRoute.post('/contacts', contactService.saveContact)
contactRoute.put('/contacts', contactService.editContact)
contactRoute.delete('/contacts', contactService.deleteContact)