import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { User } from "../entity/User"
import { UserRepository } from "../repository/UserRepository"

interface Result {
    code: string
    value?: User
}

export async function basicAuth(request: Request) {
    
    const userRepository = getCustomRepository(UserRepository)

    if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') == -1) {

        const result: Result = {code: 'É necessário o Header de Autenticação.'}

        return result
    }

    const base64Credentials = request.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    const validation = await userRepository.findByEmailAndPassword(username, password)
    
    if (validation.code == 'E-mail e/ou senha incorretos.') {

        const result: Result = {code: 'E-mail e/ou senha incorretos.'}
        
        return result 
    } 

    return validation
}