import { Request, Response } from "express";
import { getCustomRepository, getRepository, Not } from "typeorm";
import { Contact } from "../entity/Contact";
import { User } from "../entity/User";
import { basicAuth } from "../middlewares/basicAuth";
import { UserRepository } from "../repository/UserRepository";

export class ContactService {

    async viewContact(request: Request, response: Response){

        const contactRepository = getRepository(Contact)

        const validation = await basicAuth(request, response)

        if (validation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: validation })
        }

        if (validation == 'Este usuário não existe.') {

            return response.status(404).json({ message: validation })
        }

        const contacts = await contactRepository.find({ where: { user: validation }})
        
        return response.status(200).json(contacts)   
    }

    async saveContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request, response)

        if (userValidation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation })
        }

        if (userValidation == 'Este usuário não existe.') {

            return response.status(404).json({ message: userValidation })
        }

        const contact: Contact = request.body

        const contactValidation = await contactRepository.findOne({ where: { number: contact.number, user: userValidation }})

        if (contactValidation == null) {

            contact.user = userValidation

            const result = await contactRepository.save(contact)

            return response.status(201).json(result)
        
        } 
        
        return response.status(500).json({message: 'Este contato já existe.'})
    }

    async editContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request, response)

        if (userValidation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation })
        }

        if (userValidation == 'Este usuário não existe.') {

            return response.status(404).json({ message: userValidation })
        }

        const { firstName, lastName, number } = request.body
        const id_contact = request.params.id_contact

        const contactValidation = await contactRepository.findOne({ where: { number: number, user: userValidation, id: Not(id_contact) }})

        if (contactValidation == null) {

            const result = contactRepository.update(id_contact, { firstName: firstName, lastName: lastName, number: number })

            return response.status(201).json(result)
        
        } 

        return response.status(500).json({ message: 'Este contato já existe.' })
    }

    async deleteContact(request: Request, response: Response){

        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request, response)
        
        if (userValidation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation })
        }

        if (userValidation == 'Este usuário não existe.') {

            return response.status(404).json({ message: userValidation })
        }

        const id_contact = request.params.id_contact
        
        const contactValidation = await contactRepository.findOne({ where: { id: id_contact, user: userValidation }})

        if (contactValidation == null) {

            return response.status(404).json({ message: 'Este contato não existe.' })
        } 

        const result = await contactRepository.delete(id_contact)

        return response.status(204).json(result)
    }
}