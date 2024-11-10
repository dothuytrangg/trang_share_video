import { Body, ConflictException, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UnprocessableEntityException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';//loi
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/users.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { VerificationService } from 'src/verification/verification.service';
import { Verification } from 'src/verification/entities/verification.entity';
import { VerifyDto } from './dto/verify-user.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from './auth.guard';




@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private verificationService:VerificationService){}
   
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

    @Post('refresh-token')
    refreshToken(@Body() {refresh_token}):Promise<any>{
        console.log('refresh token api')
        return this.authService.refreshToken(refresh_token);
    }
    // @Post('resend-otp')
    // async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    //     const { userId } = resendOtpDto;

    //     try {
    //         const result = await this.authService.resendOtp(userId);
    //         return { success: true, message: 'OTP has been resent.', result };
    //     } catch (error) {
    //         throw new HttpException(
    //             { success: false, message: error.message },
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
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




}
