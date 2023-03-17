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
// import { AuthGuard } from 'src/guards/auth.guard';
import { LoginUserDto } from './dtos/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import Role from './role.enum';
import { JwtStrategy } from './authentication/jwt.strategy';

@Controller('users')

export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    //@Serialize(UserDto) ép kiểu trả về theo Dto
    @Get('/whoami')
    // @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }
    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }
    // Đăng ký
    @Post('/register')
    @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.name, body.username, body.roles, body.password);
        // session.userId = user.id;
        return user;

    }
    //Đăng nhập
    @Post('/login')
    async signin(@Body() body: LoginUserDto, @Session() session: any) {

        const user = await this.authService.signin(body.email, body.password);
        // session.userId = user.id;
        console.log('signin', user)
        return user
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto)) //k tra ve password
    @Get('/:id')
    async findUser(@Param('id') id: string) {
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

    // @Roles(Role.Admin)
    // @UseGuards(RolesGuard)
    @Delete('/:id')
    async removeUser(@Param('id') id: string, @CurrentUser() user: User) {
        console.log(user);
        if (user.roles !== 'admin') {
            throw new NotFoundException('Only admin can remove users');
        }
        // return this.usersService.remove(parseInt(id));
    }
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
