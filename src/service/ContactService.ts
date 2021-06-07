import { Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { Contact } from "../entity/Contact";
import { basicAuth } from "../middlewares/basicAuth";

export class ContactService {

    async viewContact(request: Request, response: Response){

        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request)

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        const contacts = await contactRepository.find({ where: { user: userValidation.value }})
        
        return response.status(200).json(contacts)   
    }

    async saveContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request)

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        const contact: Contact = request.body

        const contactValidation = await contactRepository.findOne({ where: { number: contact.number, user: userValidation.value }})

        if (contactValidation == null) {

            contact.user = userValidation.value

            const result = await contactRepository.save(contact)

            return response.status(201).json(result)
        } 
        
        return response.status(500).json({message: 'Este contato já existe.'})
    }

    async editContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request)

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        const { firstName, lastName, number } = request.body
        const id_contact = request.params.id_contact

        const contactValidation = await contactRepository.findOne({ where: { number: number, user: userValidation.value, id: Not(id_contact) }})

        if (contactValidation == null) {

            await contactRepository.update(id_contact, { firstName: firstName, lastName: lastName, number: number })

            return response.status(204).end()
        } 

        return response.status(500).json({ message: 'Este contato já existe.' })
    }

    async deleteContact(request: Request, response: Response){

        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request)
        
        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        const id_contact = request.params.id_contact
        
        const contactValidation = await contactRepository.findOne({ where: { id: id_contact, user: userValidation.value }})

        if (contactValidation == null) {

            return response.status(404).json({ message: 'Este contato não existe.' })
        } 

        await contactRepository.delete(id_contact)

        return response.status(204).end()
    }
}