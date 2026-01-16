import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GeminiClient {
    private model;

    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generate(prompt: string): Promise<string> {
        const result = await this.model.generateContent(prompt);
        return result.response.text;
    }
}