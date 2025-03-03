import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto, UserRole } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }


    async register(registerUserDto: RegisterUserDto) {

        const userExists = await this.prisma.user.findFirst({
            where: { email: registerUserDto.email }
        })

        if (userExists) {
            throw new BadRequestException('El usuario ya esta registrado')
        }

        const user = await this.prisma.user.create({
            data: {
                ...registerUserDto,
                password: bcrypt.hashSync(registerUserDto.password, 10)
            }
        })


        const { password, ...restUser } = user;

        return {
            user: restUser,
            message: 'Usuario registrado correctamente'
        }


    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;


        const user = await this.prisma.user.findFirst({
            where: { email }
        })

        if ( !user ){
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if( !isPasswordValid ){
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const { password: _, ...restUser } = user;

        return {
            user: restUser,
            token: await this.signJWT({ id: user.id, email: user.email, name: user.name, roles: user.roles as UserRole})
        }
    }

    async signJWT(payload: JwtPayload){
        return this.jwtService.sign(payload)
    }

    async verify(token: string) {
        try {
            
            const { sub, iat, exp, ...user } = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })

            return {
                user,
                token,
            }

        } catch (error) {
             throw new UnauthorizedException("Token invalido")
        }
    }


}
