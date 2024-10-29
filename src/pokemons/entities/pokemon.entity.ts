import { Max, Min } from "class-validator";
import { BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Pokemon {

    @PrimaryColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('int')
    base_experience: number;

    @Column('int',{
        nullable: true
    })
    @Min(1)
    @Max(5)
    puntuation?: number;

}

