import { IsEnum, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(UserRole)
    role?: UserRole;
}
