import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    number: string
}