import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import { basicAuth } from '../middlewares/basicAuth'
import '../connection/connection'
import { Contact } from "../entity/Contact";

export class UserService {

    async viewUser(request: Request, response: Response) {

        const userValidation = await basicAuth(request)

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        return response.status(200).json(userValidation.value)
    }

    async saveUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const user: User = request.body 

        const userValidation = await userRepository.findOne({ where: { email: user.email}})

        if (userValidation == null) {

            const passwordHash = await bcrypt.hash(user.password, 8)

            user.password = passwordHash

            const results = await userRepository.save(user)

            return response.status(201).json(results)
        
        }

        return response.status(500).json({message: 'Este e-mail já está cadastrado.'})       
    }

    async editUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const userValidation = await basicAuth(request) 

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(401).json({ message: userValidation.code })
        }

        const { name, password } = request.body

        const passwordHash = await bcrypt.hash(password, 8)

        await userRepository.update(userValidation.value.id, { name: name, password: passwordHash })

        return response.status(204).end()
    }

    async deleteUser(request: Request, response: Response) {

        const userRepository = getRepository(User)
        const contactRepository = getRepository(Contact)

        const userValidation = await basicAuth(request)

        if (userValidation.code == 'É necessário o Header de Autenticação.') {

            return response.status(401).json({ message: userValidation.code })
        }

        if (userValidation.code == 'E-mail e/ou senha incorretos.') {

            return response.status(404).json({ message: userValidation.code })
        }

        await contactRepository.delete({user: userValidation.value})

        await userRepository.delete({id: userValidation.value.id})

        return response.status(204).end() 
    }
}