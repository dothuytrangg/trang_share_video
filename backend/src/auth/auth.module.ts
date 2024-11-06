import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { VerificationModule } from 'src/verification/verification.module';
import { MessageModule } from 'src/otp-message/message.module';
import { AuthGuard } from './auth.guard';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    ConfigModule, VerificationModule, MessageModule, 
  ],

  controllers: [AuthController],
  providers: [
    AuthService, AuthGuard
   
  ],
})
export class AuthModule {}
