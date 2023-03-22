

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from 'src/users/decorators/roles.decorator';
import Role from 'src/users/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        console.log(user);

        // return requiredRoles.some((role) => user.roles === role);
    }
}

// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import Role from '../users/role.enum';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private readonly reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const roles = this.reflector.get<Role[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         const hasRole = () => roles.indexOf(user.roles) > -1;
//         return user && user.roles && hasRole();
//     }
// }

// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import Role from "src/users/role.enum";

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private readonly reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const roles = this.reflector.get<string[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }

//         const request = context.switchToHttp().getRequest();
//         const userType = request.user;
//         console.log(roles);
//         return roles.some(r => r === userType);

//     }
// }
