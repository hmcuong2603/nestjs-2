// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { User } from '../users/user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const roles = this.reflector.get<string[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         const user: User = request.user;
//         return user && roles.includes(user.roles);
//     }
// }

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import Role from 'src/users/role.enum';
import { ROLES_KEY } from 'src/users/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {


        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

        if (!requireRoles) {
            return true
        }

        const { user } = context.switchToHttp().getRequest();


        return requireRoles.some((roles) => user.roles?.includes(roles));
    }
}
