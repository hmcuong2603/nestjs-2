import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import Cookies from 'js-cookie';
const jsonwebtoken = require("jsonwebtoken");
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, name: string, username: string, password: string) {
        //See if email is in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in use');
        }
        //Hash the users password 
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        //hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        //Join the hashed result anh the
        const result = salt + '.' + hash.toString('hex');
        //Create a new user and save it
        const user = await this.usersService.create(email, name, username, result);
        //return the user
        return user;
    }


    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await (scrypt(password, salt, 32)) as Buffer;
        const authToken = jsonwebtoken.sign({ email, password }, "DUMMYKEY");
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Wrong password')
        }

        return user;
    }
} 