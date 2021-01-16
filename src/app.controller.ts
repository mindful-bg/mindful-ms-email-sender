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

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService) {
      this.host = this.configService.get('email.host');
      this.port = this.configService.get('email.port');
      this.secure = this.configService.get('email.secure');
      this.username = this.configService.get('email.username');
      this.password = this.configService.get('email.password');
    }
  
  @EventPattern('email')
  async  sendEmail(mailOptions: SendEmailOpts) {
    console.log('message received 111    ', mailOptions)
     if(!mailOptions.to) {
        throw new BadRequestException('No Email Recipient')
      }

        let transporter = nodemailer.createTransport({
            
          host: this.host,
            port: this.port,
            secure: this.secure, // true for 465, false for other ports
            auth: {
                user: this.username,
                pass: this.password
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