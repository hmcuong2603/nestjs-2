import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './authentication/jwt.strategy';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [
        JwtModule.register({
            secret: 'super-secret-cat',
            // signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UsersController],
    providers: [AuthService, JwtStrategy, JwtGuard, RolesGuard]
})
export class AuthModule { }