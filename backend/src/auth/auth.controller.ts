import { BadRequestException, Body, ConflictException, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UnprocessableEntityException, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';//loi
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/users.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyDto } from './dto/verify-user.dto';
import { VerificationService } from 'src/verification/verification.service';




@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService,
                private verification: VerificationService
    ){}
    @Post('register')
    @UsePipes(ValidationPipe)
    async register(@Body() registerUserDto: RegisterUserDto) {
        console.log('register api');
        console.log(registerUserDto);

       
            const response = await this.authService.register(registerUserDto);
            return response;
    }
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto:LoginUserDto): Promise<any>{

        console.log('login api')
       
       return this.authService.login(loginUserDto);
       

       
    }

    // @Post('refresh-token')
    // refreshToken(@Body() {refresh_token}):Promise<any>{
    //     console.log('refresh token api')
    //     return this.authService.refreshToken(refresh_token);
    // }

    @Post('verify-otp')
    @UsePipes(ValidationPipe)
    async verifyOtp(@Body() verifyDto: VerifyDto) {
        const { userId, token } = verifyDto;
        const isValid = await this.authService.verifyEmail(userId, token);
        console.log("verification", verifyDto);
        console.log("isValid", isValid);

        if (!isValid) {
            throw new UnprocessableEntityException('Invalid OTP or OTP has expired');
        }

        return { success: 'OTP verified successfully' };
    }
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Param('token') resetToken: string,
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        const { newPassword, newConfirmPassword } = resetPasswordDto;
        return this.authService.resetPassword(resetToken, newPassword, newConfirmPassword);
    }

    @Post('resend-otp')
    async resendOTP(@Body('userId') userId: number) {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        const otp = await this.verification.resendOtp(userId);
        return { message: 'OTP resent successfully', otp };
    }




}
