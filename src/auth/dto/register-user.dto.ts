import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator";


export enum UserRole {
    ADMIN = "ADMIN",
    POS = "POS"
}

export class RegisterUserDto {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsEnum(UserRole)
    roles: UserRole;



}