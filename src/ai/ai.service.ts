import { Injectable } from '@nestjs/common';
import { GeminiClient } from './gemini.client';

@Injectable()
export class AiService {
    constructor(private readonly geminiClient: GeminiClient) {}

    async analyzeTicket(ticket: {
        title: string;
        description: string;
    }) {
        const prompt = `
        You are an AI assistant for a ticket management system.

        ONLY use the information present in the ticket.
        DO NOT invent data.
        If the information is insufficient, respond with "UNKNOWN".

        Ticket title:
        "${ticket.title}"

        Ticket description:
        "${ticket.description}"

        Return ONLY valid JSON with:
        - category (TECHNICAL | BILLING | ACCOUNT | OTHER)
        - priority (LOW | MEDIUM | HIGH)
        - summary (max 2 lines)
        - confidence: a number between 0 and 1 indicating how confident you are in the classification
        `;

        const response = await this.geminiClient.generate(prompt);

        return JSON.parse(response);
    }
}
