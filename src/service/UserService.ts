import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import { basicAuth } from '../middlewares/basicAuth'
import '../connection/connection'
import { Contact } from "../entity/Contact";

export class UserService {

    async viewUser(request: Request, response: Response) {

        const validation = await basicAuth(request, response)

        if (validation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: validation })
        }

        if (validation == 'Este usuário não existe.') {

            return response.status(404).json({ message: validation })
        }

        return response.status(200).json(validation)
    }

    async saveUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const user: User = request.body 

        const validation = await userRepository.find({ where: { email: user.email}})

        if (validation[0] == null) {

            const passwordHash = await bcrypt.hash(user.password, 8)

            user.password = passwordHash

            const results = await userRepository.save(user)

            return response.status(201).json(results)
        
        } else {

            return response.status(500).json({message: 'Este e-mail já está cadastrado.'})
        }        
    }

    async editUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const validation = await basicAuth(request, response) 

        if (validation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: validation })
        }

        if (validation == 'Este usuário não existe.') {

            return response.status(404).json({ message: validation })
        }

        const id_user = request.params.id_user
        const { name, password } = request.body

        const passwordHash = await bcrypt.hash(password, 8)

        await userRepository.update(id_user, { name: name, password: passwordHash })

        return response.status(204).end()
    }

    async deleteUser(request: Request, response: Response) {

        const userRepository = getRepository(User)
        const contactRepository = getRepository(Contact)

        const id_user = request.params.id_user

        const validation = await basicAuth(request, response)

        if (validation == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: validation })
        }

        if (validation == 'Este usuário não existe.') {

            return response.status(404).json({ message: validation })
        }

        await contactRepository.delete({user: validation})

        await userRepository.delete(id_user)

        return response.status(204).end()
    }
}