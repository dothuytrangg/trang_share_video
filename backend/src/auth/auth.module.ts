import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { VerificationService } from 'src/verification/verification.service';
import { EmailService } from 'src/otp-message/email.service';
import { Verification } from 'src/verification/entities/verification.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Verification]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    VerificationService,
    EmailService
   
  ],
})
export class AuthModule {}
