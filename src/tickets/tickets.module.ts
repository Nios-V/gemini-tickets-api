import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { UsersModule } from 'src/users/users.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    UsersModule,
    AiModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
