import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:null})
    name: string;

    @Column({unique:true, default:null})
    email:string;

    @Column({nullable: false, default:null})
    password: string;
}