import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketStatusDto extends PartialType(CreateTicketDto) {
    @IsEnum(TicketStatus)
    status: TicketStatus;
}
