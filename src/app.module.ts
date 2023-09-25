import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { TrelloModule } from './trello/trello.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // Configure ConfigModule
    TrelloModule,
  ],
})
export class AppModule {}
