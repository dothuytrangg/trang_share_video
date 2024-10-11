import { Body, ConflictException, Controller, Get, HttpException, HttpStatus, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';//loi
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/users.entity';
import { LoginUserDto } from './dto/login-user.dto';




@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
   
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



}
