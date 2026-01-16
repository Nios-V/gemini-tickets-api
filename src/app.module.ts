import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AiModule } from './ai/ai.module';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
       inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<number>('DB_PORT')),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        }),
      }),
    UsersModule,
    TicketsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
