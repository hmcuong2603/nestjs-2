import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './authentication/jwt.strategy';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';

@Module({
    imports: [
        JwtModule.register({
            secret: 'super-secret-cat',
            // signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forFeature([User]), UsersModule, PassportModule
    ],
    controllers: [UsersController],
    providers: [AuthService, JwtStrategy, RolesGuard]
})
export class AuthModule { }