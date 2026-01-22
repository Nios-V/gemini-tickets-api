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
        - reason: brief explanation of the classification
        - emotionalTone: brief description of the emotional tone of the user ('ANGRY' | 'NEUTRAL' | 'FRUSTRATED' | 'GRATEFUL' | 'SAD' | 'HAPPY')
        - suggestedReply: a short, empathetic reply to the user
        `;

        const response = await this.geminiClient.generate(prompt);
        
        const cleanedResponse = this.cleanJson(response);
    
    try {
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error('Failed to parse:', cleanedResponse);
        return {
            category: 'OTHER',
            priority: 'MEDIUM',
            summary: 'Unable to analyze ticket automatically',
            confidence: 0,
            reason: 'AI response parsing failed',
            emotionalTone: 'NEUTRAL',
            suggestedReply: 'Thank you for reaching out. We will look into your issue and get back to you shortly.'
        };
    }
    }

    private cleanJson(response: string): string {
    let cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    
    return cleaned;
}
}
