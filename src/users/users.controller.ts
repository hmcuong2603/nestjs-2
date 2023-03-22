import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Query,
    NotFoundException, Session, UnauthorizedException, ForbiddenException
} from '@nestjs/common';
import { Delete, Req, UseGuards } from '@nestjs/common/decorators';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginUserDto } from './dtos/login-user-dto';
import { AuthMiddleware } from './middlewares/auth.middlewares';
import { Roles } from './decorators/roles.decorator';
import Role from './role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    //@Serialize(UserDto) ép kiểu trả về theo Dto
    @Get('/whoami')
    // @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user
    }


    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }
    // Đăng ký
    @Post('/register')
    // @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.name, body.username, body.roles, body.password);
        session.userId = user.id;
        return user;

    }
    //Đăng nhập
    @Post('/login')
    async signin(@Body() body: LoginUserDto, @Session() session: any) {

        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        // console.log('signin', user)
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

    @Delete('/:id')
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(RolesGuard)
    // @Roles(Role.Admin)
    async removeUser(@Param('id') id: string, @CurrentUser() user: User) {
        // console.log(user);

        // console.log('userDelete', user);
        // throw new ForbiddenException(); // Xác thực thất bại nếu người dùng không có quyền xóa tài khoản
        // await this.usersService.remove(parseInt(id));
        // return { message: 'User deleted successfully' };
        return this.usersService.remove(parseInt(id));
    }
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
