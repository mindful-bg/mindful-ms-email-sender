import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { MindfulCoreModule } from 'ms-helpers-lib';

@Global()
@Module({
  imports: [
    MindfulCoreModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MindfulCoreModule],
})
export class AppModule {}
