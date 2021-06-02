import express from 'express'
import { auth } from '../middlewares/auth'
import { UserService } from '../service/UserService'

export const userRoute = express.Router()

const userService = new UserService()

userRoute.post('/session', userService.login)
userRoute.post('/users', userService.saveUser)

userRoute.use(auth)

userRoute.get('/users', userService.viewUser)
userRoute.put('/users/:id_user', userService.editUser)
userRoute.delete('/users/:id_user', userService.deleteUser)