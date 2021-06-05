import { AbstractRepository, EntityRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {

    async findByEmailAndPassword(email: string, password: string) {

        const user = await this.repository.find({where: {email: email}})

        if (user[0] == null) {

            return false

        } else {

            if (await bcrypt.compare(password, user[0].password)) {
               
                return user[0]

            } else {
                
                return false
            }
        }
    }
}