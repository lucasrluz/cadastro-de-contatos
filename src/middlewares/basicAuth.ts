import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UserRepository } from "../repository/UserRepository"

export async function basicAuth(request: Request, response: Response) {

    const userRepository = getCustomRepository(UserRepository)

    if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') == -1) {

        return 'É necessário o Header de Autenticação.'
    }

    const base64Credentials = request.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    const validation = await userRepository.findByEmailAndPassword(username, password)
    
    if (validation == false) {

        return 'Este usuário não existe.'

    } 

    return validation
}