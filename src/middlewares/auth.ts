import { NextFunction, Request, Response } from "express"
import * as jwt from 'jsonwebtoken'

export const auth = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization

    if (!authHeader) response.status(401).json({message: 'É necessário o Token.'})

    const [ ,token] = authHeader.split(' ')

    try {
        
        await jwt.verify(token, process.env.APP_SECRET)
        next()
        
    } catch (error) {
        
        response.status(401).json({message: 'Token inválido'})
    }
}