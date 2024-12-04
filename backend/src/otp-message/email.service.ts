import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv'


@Injectable()
export class EmailService {
    private mailTransport : Transporter;
    constructor(private configService: ConfigService) {
        this.mailTransport = createTransport({
            host: this.configService.get('MAIL_HOST'),
            service: "gmail",
            secure: true, 
            
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }

    async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
        const { sender, recipients, subject, html, text } = data;

        const mailOptions: SendMailOptions = {
            from: sender ?? {
                name: this.configService.get('MAIL_SENDER_NAME_DEFAULT'),
                address: this.configService.get('MAIL_USER'),
            },
            to: recipients,
            subject,
            html, // valid HTML body
            text, // plain text body
        };

        try {
            await this.mailTransport.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            // handle error
            console.error("Failed to send email:", error.message)
            return null;
        }
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `${process.env.NEXT_URL_PROD}/vn/reset_password?token=${token}`; 
        const mailOptions = {
            from: this.configService.get('MAIL_SENDER_NAME_DEFAULT'),

            to: to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
        };
      //  console.log(mailOptions)
        console.log('MAIL_SENDER_NAME_DEFAULT:', this.configService.get('MAIL_SENDER_NAME_DEFAULT'));
        console.log("resetLink:", resetLink);

        await this.mailTransport.sendMail(mailOptions);
    }
}