import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import {LoggerModule} from 'mindful-commons';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
   
  ],
})
export class AppModule {}
