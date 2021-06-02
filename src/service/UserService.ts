import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'

import '../connection/connection'

export class UserService {

    async viewUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const results = await userRepository.find()

        response.status(200).json(results)
    }

    async saveUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const user: User = request.body 

        const validation = await userRepository.find({ where: { email: user.email}})

        if (validation[0] == null) {

            const passwordHash = await bcrypt.hash(user.password, 8)

            user.password = passwordHash

            const results = await userRepository.save(user)

            response.status(201).json(results)
        
        } else {

            response.status(500).json({message: 'Este e-mail já está cadastrado.'})
        }        
    }

    async editUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const validation = await userRepository.find({ where: { email: request.body.email}})

        if (validation[0] == null) {

            const { name, email, password } = request.body
            const id_user = request.params.id_user

            const passwordHash = await bcrypt.hash(password, 8)

            await userRepository.update(id_user, { name: name, email: email, password: passwordHash })

            response.status(204).end()
        
        } else {

            response.status(500).json({message: 'Este e-mail já está cadastrado.'})
        }    
    }

    async deleteUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const id_user = request.params.id_user

        const validation = await userRepository.find({ where: { id: id_user} })

        if (validation[0] == null) {

            response.status(500).json({message: 'Este usuário não existe.'})
            
        } else {

            await userRepository.delete(id_user)

            response.status(204).end()
        }
    }
}