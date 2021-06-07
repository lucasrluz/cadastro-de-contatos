import { AbstractRepository, EntityRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'

interface Result {
    code: string
    value?: User
}
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {

    async findByEmailAndPassword(email: string, password: string) {

        const user = await this.repository.findOne({where: {email: email}})

        if (user == null) {

            const result: Result = {code: 'E-mail e/ou senha incorretos.'} 

            return result
        } 

        const userPassword = await bcrypt.compare(password, user.password)

        if (!userPassword) {

            const result: Result = {code: 'E-mail e/ou senha incorretos.'}

            return result
            
        } 
            
        const result: Result = {code: 'Usuário encontrado', value: user}

        return result
    }
}