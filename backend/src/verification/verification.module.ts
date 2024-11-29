import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationService } from './verification.service';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/entities/users.entity';
import { Verification } from './entities/verification.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Verification, User]),  // Register both Verification and User entities
    ],
    providers: [VerificationService],
    exports: [VerificationService],
})
export class VerificationModule { }
