import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.CurrentUser) {
            return false
        }
        return request.currentUser;
    }
}

// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AdminGuard implements CanActivate {
//     canActivate(
//         context: ExecutionContext,
//     ): boolean | Promise<boolean> | Observable<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         return user && user.admin;
//     }
// }
