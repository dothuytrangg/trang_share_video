import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { Verification } from "./entities/verification.entity";
import { generateOtp } from "./utils/otp.util";
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerificationService {
    private readonly minRequestIntervalMinutes = 1;
    private readonly tokenExpirationMinutes = 15;
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(Verification)
        private tokenRepository: Repository<Verification>,
    ) { }

    // Generate OTP
    async generateOtp(userId: number, size = 6): Promise<string> {
        const now = new Date();
        const recentToken = await this.tokenRepository.findOne({
            where: {
                userId,
                createdAt: MoreThan(
                    new Date(now.getTime() - this.minRequestIntervalMinutes * 30 * 1000),
                ),
            },
        });

        if (recentToken) {
            throw new UnprocessableEntityException('Please wait before requesting a new OTP');
        }

        const otp = generateOtp(size);
        const hashedToken = await bcrypt.hash(otp, this.saltRounds);

        const tokenEntity = this.tokenRepository.create({
            userId,
            token: hashedToken,
            expiresAt: new Date(now.getTime() + this.tokenExpirationMinutes * 60 * 1000),
        });

        await this.tokenRepository.delete({ userId }); // Remove old tokens for the user
        await this.tokenRepository.save(tokenEntity);
        return otp;
    }

    // Validate OTP
    async validateOtp(userId: number, token: string): Promise<boolean> {
        // Truy vấn token dựa trên userId
        const storedToken = await this.tokenRepository.findOne({ where: { userId } });
        console.log("Stored Token:", storedToken);

        // Nếu không tìm thấy token, trả về false
        if (!storedToken) {
            console.log("No token found for user:", userId);
            return false;
        }

        // So sánh token đã nhập với token trong cơ sở dữ liệu
        const isTokenValid = await bcrypt.compare(token, storedToken.token);
        console.log("Is Token Valid:", isTokenValid);

        return isTokenValid;
    }

    // Create a verification token for email verification or reset password
    async createVerificationToken(userId: number, token: string, expiresAt: Date) {
        const verification = this.tokenRepository.create({
            userId,
            token, // lưu token gốc, không mã hóa
            expiresAt,
        });
        console.log("Token saved:", token); // In token khi lưu vào DB
        await this.tokenRepository.save(verification);
    }
   
    // Remove verification token from the database
    async removeVerification(verification: Verification): Promise<void> {
        await this.tokenRepository.remove(verification);
    }

    // Resend OTP to user
    async resendOtp(userId: number): Promise<string> {
        const otp = await this.generateOtp(userId);
        return otp;
    }
}
