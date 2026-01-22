import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GeminiClient {
     private readonly client: GoogleGenerativeAI;
    private readonly model;

    constructor() {
        this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generate(prompt: string): Promise<string> {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}