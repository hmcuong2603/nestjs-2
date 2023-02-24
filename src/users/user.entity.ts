import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Create a new User success !', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Update user Success !', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Remove user Success !', this.id);
    }
}
