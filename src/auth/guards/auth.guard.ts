
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException("No tiene acceso al sistema")
        }


        try {

            const { sub, iat, exp, ...user } = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })

            request.user = user;
            request.token = token

        } catch (error) {
            throw new UnauthorizedException("No tiene acceso al sistema")
        }



        return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined {

        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;

    }


}
