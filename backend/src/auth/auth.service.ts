import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt  from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository:Repository<User>
    ){}

    async register(registerUserDto:RegisterUserDto):Promise<User>{
        const hashPassword = await this.hashPassword(registerUserDto.password)
        return await this.userRepository.save({...registerUserDto,refresh_token:"refresh_token_string",password:hashPassword});
    }

    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne(
            {
                where:{email:loginUserDto.email}
            }
        )
        if(!user){
            throw new HttpException("Email is not exist",HttpStatus.UNAUTHORIZED);

        }
        const checkPass = bcrypt.compareSync(loginUserDto.password,user.password)
        if(!checkPass){
            throw new HttpException("password is not correct",HttpStatus.UNAUTHORIZED);
        }
        //generate access token and refresh token
        // const payload = {id:user.id,email:user.email};
        // return this.generateToken(payload);
        return user;
      
    }
    private async hashPassword(password:string):Promise<string>{
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password,salt);
        return hash;
    }


}
