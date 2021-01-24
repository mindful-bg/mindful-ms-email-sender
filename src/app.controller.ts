import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import * as nodemailer from 'nodemailer';
import {MindfulLogger, MindfulMsPayload, SendEmailOpts} from 'mindful-commons';

@Controller()
export class AppController {
  private host: string;
  private port: string;
  private secure: boolean;
  private username: string; 
  private password: string;

  private  usernamePasswordMap = new Map<string, string>();
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly logger: MindfulLogger 
    ) {
      this.host = this.configService.get('email.host');
      this.port = this.configService.get('email.port');
      this.secure = this.configService.get('email.secure');

      if(!this.host) {
        this.logger.error('Not found config for email.host', 'Out of context')
        throw new Error('Not found config for email.host')
      }
      if(!this.port) {
        this.logger.error('Not found config for email.port', 'Out of context')
        throw new Error('Not found config for email.port')
      }
      if(!this.secure) {
        this.logger.error('Not found config for email.secure', 'Out of context')
        throw new Error('Not found config for email.secure')
      }
      const usernames = this.configService.get('email.usernames').split(",");
      const passwords = this.configService.get('email.passwords').split(",");
      if(usernames.length ===0) {
        this.logger.error('Not found config for email.usernames', 'Out of context')
        throw new Error('Not found config for email.usernames')
      }
      if(passwords.length !== usernames.length) {
        this.logger.error('Wrong config for email.passwords', 'Out of context')
        throw new Error('Wrong config for email.passwords')
      }
      usernames.forEach((username, index) => {
        this.usernamePasswordMap.set(username, passwords[index]);
      })
    }
  
    @EventPattern("send-email")    
    async handleSendEmail(mindfulPayload: MindfulMsPayload<SendEmailOpts>) { 

      const loggedUserEmailIfProvided = mindfulPayload.loggedUser ? mindfulPayload.loggedUser.email : null;
      const username = mindfulPayload.payload.from.split('<')[1].split('>')[0];
     const password = this.usernamePasswordMap.get(username);

     this.logger.log('About to send email to recepient', mindfulPayload.trace,loggedUserEmailIfProvided)
     if(!mindfulPayload.payload.to) {
      this.logger.error(`No email recepient`, mindfulPayload.trace, loggedUserEmailIfProvided)
        throw new Error('No Email Recipient')
      }

      try { 
        let transporter = nodemailer.createTransport({
            
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: username,
                pass: password
            },
            
            
        });

         await transporter.sendMail(mindfulPayload.payload, async (error, info) => {
                if (error) {      
                  console.log('Could not send email, err', error);
                  }                
                
                }
    
          
            );      
  
      } catch(e) {
          this.logger.error('Something went wrong when sending email' + e.toString(), loggedUserEmailIfProvided)
      }

    }
}



