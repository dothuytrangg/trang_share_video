import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigModule } from "@nestjs/config/dist/config.module";


@Module({
    imports: [ConfigModule], 
    providers: [EmailService],
    exports: [EmailService],
})
export class MessageModule { }