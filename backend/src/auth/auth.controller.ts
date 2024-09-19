import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';//loi
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/users.entity';
import { LoginUserDto } from './dto/login-user.dto';




@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
   
    @Post('register')
    @UsePipes(ValidationPipe)
    register(@Body() registerUserDto:RegisterUserDto) {

        console.log('resgister api')
       
       console.log(registerUserDto);

       return this.authService.register(registerUserDto)

       
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
