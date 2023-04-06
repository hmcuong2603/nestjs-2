import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Query,
    NotFoundException, Session, Request, BadRequestException, Headers, UnauthorizedException
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginUserDto } from './dtos/login-user-dto';


@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    //@Serialize(UserDto) ép kiểu trả về theo Dto
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        // this.usersService.findOne(user.id)
        console.log('whoamI', user);
        return user
    }

    @Post('/signout')
    signOut(@Request() req: any) {
        // Check if authorization header exists and has a value
        if (!req.headers.authorization || req.headers.authorization.indexOf(' ') === -1) {
            throw new BadRequestException('Invalid authorization header');
        }
        // Split the header value and get the token
        const [scheme, token] = req.headers.authorization.split(' ');
        return { "message": "Logout success" }
    }

    // Đăng ký

    @Post('/register')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.name, body.username, body.roles, body.password);
        // session.userId = user.id;
        return user;
    }
    //Đăng nhập
    @Post('/login')
    async signin(@Body() body: LoginUserDto) {
        const user = await this.authService.signin(body.email, body.password);
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
    async removeUser(@Param('id') id: string, @Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        const user = await this.authService.validateUser(token);
        if (!user) {
            throw new NotFoundException('Token has expired, Log in again to continue !');
        }
        if (user.roles !== 'admin') {
            throw new UnauthorizedException('Only admin users can perform this action.');
        }

        return this.usersService.remove(parseInt(id));
    }
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        const user = await this.authService.validateUser(token);
        if (!user) {
            throw new NotFoundException('Token has expired, Log in again to continue !');
        }
        if (user.roles !== 'admin') {
            throw new UnauthorizedException('Only admin users can perform this action.');
        }
        return this.usersService.update(parseInt(id), body);
    }
}
