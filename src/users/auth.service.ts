import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { JwtService } from "@nestjs/jwt";
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    find(roles: string) {
        throw new Error('Method not implemented.');
    }
    verifyToken(token: string) {
        throw new Error('Method not implemented.');
    }
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,

    ) { }

    async signup(email: string, name: string, username: string, roles: string, password: string) {
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
        const user = await this.usersService.create(email, name, username, roles, result);
        const token = this.createToken(user);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            roles: user.roles,
            ...token
        };
    }


    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await (scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Wrong password')
        }

        const token = this.createToken(user);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            roles: user.roles,
            ...token
        };


    }

    async validateUser(email) {
        const user = await this.usersService.find(email);
        if (!user) {
            throw new HttpException("Invalid Token", HttpStatus.UNAUTHORIZED);
        }
        return user
    }

    private createToken({ id, email, name, username, roles, password }) {
        const accessToken = this.jwtService.sign({ id, email, name, username, roles, password });
        return {
            expiresIn: 720,
            accessToken
        }
    }
}
