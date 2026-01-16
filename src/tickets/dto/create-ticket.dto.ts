import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { TicketPriority } from "../entities/ticket.entity";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    description: string;
    
    @IsOptional()
    @IsEnum(TicketPriority)
    priority: TicketPriority;

    @IsString()
    @IsNotEmpty()
    createdByEmail: string;
}
