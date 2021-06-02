import { Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import '../connection/connection'

export class UserService {

    async login(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const {email, password} = request.body

        const validation = await userRepository.find({ where: { email: email}})

        if (validation[0] == null) {

            return response.status(404).json({message: 'Este usuário não existe.'})
            
        } else {

            if (await bcrypt.compare(password, validation[0].password)) {

                const token = jwt.sign({id: validation[0].id}, process.env.APP_SECRET, {expiresIn: '1d'})

                const data = {
                    id: validation[0].id,
                    name: validation[0].name,
                    email: validation[0].email,
                    token
                }

                return response.status(200).json(data)

            } else {
                
                return response.status(404).json({message: 'Este usuário não existe.'})
            }
        } 
    }

    async viewUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const results = await userRepository.find()

        return response.status(200).json(results)
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

        const validation = await userRepository.find({ where: { email: request.body.email, id: Not(request.params.id_user)}})

        if (validation[0] == null) {

            const { name, email, password } = request.body
            const id_user = request.params.id_user

            const passwordHash = await bcrypt.hash(password, 8)

            await userRepository.update(id_user, { name: name, email: email, password: passwordHash })

            return response.status(204).end()
        
        } else {

            return response.status(500).json({message: 'Este e-mail já está cadastrado.'})
        }    
    }

    async deleteUser(request: Request, response: Response) {

        const userRepository = getRepository(User)

        const id_user = request.params.id_user

        const validation = await userRepository.find({ where: { id: id_user} })

        if (validation[0] == null) {

            return response.status(500).json({message: 'Este usuário não existe.'})
            
        } else {

            await userRepository.delete(id_user)

            return response.status(204).end()
        }
    }
}