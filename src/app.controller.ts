import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import * as nodemailer from 'nodemailer';

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
    private readonly configService: ConfigService) {
      this.host = this.configService.get('email.host');
      this.port = this.configService.get('email.port');
      this.secure = this.configService.get('email.secure');

      const usernames = this.configService.get('email.usernames').split(",");
      const passwords = this.configService.get('email.passwords').split(",");
      
      usernames.forEach((username, index) => {
        this.usernamePasswordMap.set(username, passwords[index]);
      })
    }
  
  @EventPattern('email')
  async  sendEmail(mailOptions: SendEmailOpts) {
    
     const username = mailOptions.from.split('<')[1].split('>')[0];
     const password = this.usernamePasswordMap.get(username);
     if(!password) {
        throw new Error('Password for this username not found')
     }

     if(!mailOptions.to) {
        throw new Error('No Email Recipient')
      }

        let transporter = nodemailer.createTransport({
            
          host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: username,
                pass: password
            },
            
            
        });

         await transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {      
                  console.log('Could not send email, err', error);
                  }                
                
                }
    
          
            );      
  }
}
export interface SendEmailOpts {
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  attachments?: EmailFileAttachment[];
}

export interface EmailFileAttachment {
  filename: string,
  content: Buffer,
  contentType: string;
}
