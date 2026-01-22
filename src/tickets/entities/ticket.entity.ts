import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED"
}

export enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM
    })
    priority: TicketPriority;

    @Column({ nullable: true })
    category?: string;

    @Column({ type: 'float', nullable: true })
    aiConfidence?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    aiSummary?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reason?: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    emotionalTone?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    suggestedReply?: string;

    @ManyToOne(() => User, (user) => user.tickets, { eager: true })
    createdBy: User;

    @ManyToOne(() => User, (user) => user.assignedTickets, {
        nullable: true,
        eager: true,
    })
    assignedTo?: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
