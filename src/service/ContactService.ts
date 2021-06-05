import { Request, Response } from "express";
import { getCustomRepository, getRepository, Not } from "typeorm";
import { Contact } from "../entity/Contact";
import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";


export class ContactService {

    async viewContact(request: Request, response: Response){

        const userRepository = getCustomRepository(UserRepository)

        const contactRepository = getRepository(Contact)

        const { email, password } = request.body

        const validation = await userRepository.findByEmailAndPassword(email, password)
        
        if (validation == false) {

            return response.status(404).json({ message: 'Este usuário não existe.' })
            
        } else {
            
            const contacts = await contactRepository.find({ where: { user: validation }})

            return response.status(200).json(contacts)
        }
    }

    async saveContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)
        const userRepository = getRepository(User)

        const { number, id_user } = request.body

        const contact: Contact = request.body

        const user = await userRepository.find({ where: { id: id_user }})

        const validation = await contactRepository.find({ where: { number: number }})

        if (validation[0] == null) {

            contact.user = user[0]

            const result = await contactRepository.save(contact)

            return response.status(201).json(result)
        
        } else {

            return response.status(500).json({message: 'Este contato já existe.'})
        }
    }

    async editContact(request: Request, response: Response){
        
        const contactRepository = getRepository(Contact)

        const { id_contact, firstName, lastName, number } = request.body

        const validation = await contactRepository.find({ where: { number: number, id: Not(id_contact) }})

        if (validation[0] == null) {

            const result = contactRepository.update(id_contact, { firstName: firstName, lastName: lastName, number: number })

            return response.status(201).json(result)
        
        } else {

            return response.status(500).json({ message: 'Este contato já existe.' })
        }
    }

    async deleteContact(request: Request, response: Response){

        const contactRepository = getRepository(Contact)
        const userRepository = getCustomRepository(UserRepository)

        const { id_contact, email, password } = request.body
        
        const validationUser = await userRepository.findByEmailAndPassword(email, password)

        if (validationUser == false) {

            return response.status(404).json({ message: 'Este usuário não existe.' })
        
        } 
        
        const validationContact = await contactRepository.find({ where: { id: id_contact, user: validationUser }})

        if (validationContact[0] == null) {

            return response.status(404).json({ message: 'Este contato não existe.' })
        
        } 

        const result = contactRepository.delete({ id: id_contact, user: validationUser })

        return response.status(204).json(result)
    }
}