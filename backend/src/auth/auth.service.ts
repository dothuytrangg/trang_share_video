import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { common_response } from 'src/ultils/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    let response = common_response;
    const email = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (email) {
      response.success = false;
      response.message = 'Email already existed';
      return response;
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    let user = await this.userRepository.save({
        ...registerUserDto,
        refresh_token: 'refresh_token_string',
        password: hashPassword,
    });
    if(user){
        response.success = true;
    }
    return response;
  }

  async login(loginUserDto: LoginUserDto) {
    let response = common_response
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
        response.success = false;
        response.message = "User not existing."
        return response;
    }
    const checkPass = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!checkPass) {
       response.success = false;
        response.message = "Password incorrect."
        return response;
    }
    //generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    let token =  await this.generateToken(payload);
    let responseUser:any;
    if(token.access_token){
        response.message = ''
        response.success = true;
        responseUser = {...response};
        responseUser.token = token.access_token;
        responseUser.user = {
            id: user.id, email: user.email, name:user.full_name, role:user.role
        }
        return responseUser;
    }
    return response;
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async generateToken(payload: { id: number; email: string}) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRE'),
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );

    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, saltRound);
    return hash;
  }
}
