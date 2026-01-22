import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiClient } from './gemini.client';

@Module({
  providers: [AiService, GeminiClient],
  exports: [AiService],
})
export class AiModule {}
