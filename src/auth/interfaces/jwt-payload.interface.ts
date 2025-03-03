import { UserRole } from "../dto/register-user.dto";


export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    roles: UserRole;
}