import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
    html: string;
    text?: string;
    subject: string;
    sender?: Address;
    recipients: Address[];

}
