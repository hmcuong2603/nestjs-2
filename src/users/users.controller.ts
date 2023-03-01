import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Query,
    NotFoundException, Session
} from '@nestjs/common';
import { Delete, UseGuards } from '@nestjs/common/decorators';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginUserDto } from './dtos/login-user-dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }
    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }
    // Đăng ký
    @Post('/register')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.name, body.username, body.password);
        // const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
        // this.usersService.create(body);

    }
    //Đăng nhập
    @Post('/login')
    async signin(@Body() body: LoginUserDto, @Session() session: any) {

        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto)) //k tra ve password
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // console.log(`handle is running - ${id}`);
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
