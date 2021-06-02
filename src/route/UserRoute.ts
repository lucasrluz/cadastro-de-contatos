import express from 'express'
import { UserService } from '../service/UserService'

export const userRoute = express.Router()

const userService = new UserService()

userRoute.get('/users', userService.viewUser)
userRoute.post('/users', userService.saveUser)
userRoute.put('/users/:id_user', userService.editUser)
userRoute.delete('/users/:id_user', userService.deleteUser)