import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "./Contact";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email:string

    @Column()
    password: string

    @OneToMany(() => Contact, contact => contact.user)
    contacts: Contact[]
}