import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, 'super-secret-cat');
                req.user = decoded;
                next();
            } catch (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } else {
            return res.status(401).json({ message: 'Authorization header not found' });
        }
    }
}
