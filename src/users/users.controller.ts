import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Query,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { SerializeInterceptor, Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    // Đăng ký
    @Post('/register')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body);
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handle is running');

        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not Found !');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }
    @Get('/users')
    getAllUsers(User) {
        return this.usersService.find(User);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
