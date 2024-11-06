import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from 'src/verification/verification.module';
import { MessageModule } from 'src/otp-message/message.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),ConfigModule,
    VerificationModule, MessageModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],

})
export class UsersModule {}
