import express from 'express'
import { ContactService } from '../service/ContactService'

export const contactRoute = express.Router()

const contactService = new ContactService()

contactRoute.get('/contacts', contactService.viewContact)
contactRoute.post('/contacts', contactService.saveContact)
contactRoute.put('/contacts/:id_contact', contactService.editContact)
contactRoute.delete('/contacts/:id_contact', contactService.deleteContact)