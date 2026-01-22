import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketPriority, TicketStatus } from './entities/ticket.entity';
import { Repository, DataSource } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    return this.dataSource.transaction(async manager => {
      const userRepo = manager.getRepository(User);
      const ticketRepo = manager.getRepository(Ticket);

      let user = await userRepo.findOne({ where: { email: dto.createdByEmail } });

      if (!user) {
        user = userRepo.create({
          email: dto.createdByEmail.toLowerCase().trim(),
          name: dto.createdByEmail.toLowerCase().trim().split('@')[0],
          active: true,
          role: UserRole.USER,
        });
        user = await userRepo.save(user);
      }

      const ticket = ticketRepo.create({
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? TicketPriority.MEDIUM,
        status: TicketStatus.OPEN,
        createdBy: user,
      });

      const ticketCreated = await ticketRepo.save(ticket);

      if (process.env.AI_ENABLED === 'true') {
        await this.analyzeTicketWithAI(ticketCreated);
      }
      return ticketCreated;
    });
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: ['createdBy']
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async updateStatus(id: string, updateTicketStatusDto:  UpdateTicketStatusDto) {
    const ticket = await this.findOne(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const actor = await this.usersService.findByEmail(updateTicketStatusDto.actorEmail);

    if (!actor) {
      throw new BadRequestException('Actor not found');
    }

    if (![UserRole.ADMIN, UserRole.AGENT].includes(actor.role)) {
      throw new BadRequestException('Only admins and support agents can update ticket status');
    }

    ticket.status = updateTicketStatusDto.status;
    return this.ticketsRepository.save(ticket);
  }

  private async analyzeTicketWithAI(ticket: Ticket) {
    try {
      const analysis = await this.aiService.analyzeTicket({
        title: ticket.title,
        description: ticket.description,
      });

      if (!analysis.confidence || analysis.confidence < 0.7) {
        console.log('AI confidence too low, skipping update');
        return;
      }
      if (analysis.category !== 'UNKNOWN') ticket.category = analysis.category;
      if (analysis.priority !== 'UNKNOWN') ticket.priority = analysis.priority;
      if (analysis.summary !== 'UNKNOWN') ticket.aiSummary = analysis.summary;
      if (analysis.confidence !== 'UNKNOWN') ticket.aiConfidence = analysis.confidence;

      return this.ticketsRepository.update(ticket.id, {
        category: ticket.category,
        priority: ticket.priority,
        aiSummary: ticket.aiSummary,
        aiConfidence: ticket.aiConfidence,
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  }
}
