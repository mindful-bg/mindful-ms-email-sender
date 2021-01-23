import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import {CreateUpdateLogDto} from 'mindful-commons';

@Injectable() 
export class MindfulLogger {
    private serviceName: string;

    constructor(
        @Inject('LOGGER_MS') private readonly logger: ClientProxy,
        private readonly configService: ConfigService 
    ) {
        this.serviceName = this.configService.get('serviceName');
    }

    async log(info: string, trace: string, userEmail?: string, route?: string) {
        const log: CreateUpdateLogDto = {id: trace, userEmail, info, route};
        log.isError = false;
        log.serviceIdentificator = this.serviceName;
        this.logger.emit('log', log);
    }

    async error(info: string, trace: string, userEmail?: string, route?: string) {
        const log: CreateUpdateLogDto = {id: trace, userEmail, info, route};
        log.isError = true;
        log.serviceIdentificator = this.serviceName;
        this.logger.emit('log', log);
    }


}