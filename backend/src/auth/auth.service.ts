import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/users.entity';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { common_response } from 'src/ultils/common';
import validator from 'validator';
import { EmailService } from 'src/otp-message/email.service';
import { VerificationService } from 'src/verification/verification.service';
import { randomBytes } from 'crypto';
import { Verification } from 'src/verification/entities/verification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Verification) private tokenRepository: Repository<Verification>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private verificationService: VerificationService,
    private emailService: EmailService
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    let response = common_response;

    if (!validator.isEmail(registerUserDto.email)) {
      response.success = false;
      response.message = 'Email must be a valid email...';
      return response;
    }

    if (!registerUserDto.password) {
      response.success = false;
      response.message = 'Password cannot be empty';
      return response;
    }

    const existingUser = await this.userRepository.findOne({ where: { email: registerUserDto.email } });
    if (existingUser) {
      response.success = false;
      response.message = 'You are already registered. Please log in.';
      response.errorCode = 'USER_EXISTS';
      return response;
    }

    const hashPassword = await this.hashPassword(registerUserDto.password);
    let user = await this.userRepository.save({
      ...registerUserDto,
      password: hashPassword,
      statusVerify: 'inactive',
    });

    if (user) {
      try {
        // Generate OTP
        const otp = await this.verificationService.generateOtp(user.id);
        console.log('OTP:', otp);
        console.log("user", user.id);
        user.statusVerify = "inactive";

        // Send OTP to user's email
        await this.emailService.sendEmail({
          subject: 'MyApp - Account Verification',
          recipients: [{ name: user.full_name ?? '', address: user.email }],
          html: `<p>Hi${user.full_name ? ' ' + user.full_name : ''},</p><p>You may verify your MyApp account using the following OTP: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Regards,<br />MyApp</p>`,
        });

        // Generate token for email verification or login purposes
        const token = this.generateToken(user);

        response.success = true;
        response.message = 'Registration successful. Please verify your email with the OTP sent.';
        response.token = token; // Include the token in the response
        response.userId = user.id; // Include userId in the response
      } catch (error) {
        response.success = false;
        response.message = 'Registration successful, but failed to send OTP';
      }
    } else {
      response.success = false;
      response.message = 'Registration failed';
    }

    return response;
  }

  async findUserById(id: any) {
    let user = await this.userRepository.findOne({ where: { id: id } });
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    let response = common_response;
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      response.success = false;
      response.errorCode = 'USER_NOT_FOUND';
      return response;
    }

    if (!validator.isEmail(loginUserDto.email)) {
      response.success = false;
      response.message = 'Email must be a valid email...';
      return response;
    }

    const checkPass = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );

    if (user.statusVerify == 'inactive') {
      response.success = false;
      response.message = "Please verify your email before logging in.";
      return response;
    }

    if (!checkPass) {
      response.success = false;
      response.message = "Password incorrect.";
      return response;
    }

    // Generate access token and refresh token
    const payload = { id: user.id, email: user.email, role: user.role };
    let token = await this.generateToken(payload);
    let responseUser: any;
    console.log('user: ', user);

    if (token.access_token) {
      response.message = '';
      response.success = true;
      responseUser = { ...response };
      responseUser.token = token.access_token;
      responseUser.user = {
        id: user.id, email: user.email, name: user.full_name, role: user.role, avatar: user.avatar
      };
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
        return this.generateToken({ id: verify.id, email: verify.email, role: verify.role });
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

  private async generateToken(payload: { id: number; email: string; role: number }) {
    // Generate only access_token
    const access_token = await this.jwtService.signAsync(payload);

    // No need to generate or store refresh_token
    return { access_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, saltRound);
    return hash;
  }

  async verifyEmail(userId: number, token: string) {
    const invalidMessage = 'Invalid or expired OTP';

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const isValid = await this.verificationService.validateOtp(user.id, token);
    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    // Update status after successful verification
    user.emailVerifiedAt = new Date();
    user.statusVerify = 'active'; // Update `statusVerify` to 'active'
    await this.userRepository.save(user); // Save only after updating status

    return true;
  }

  async forgotPassword(email: string) {
    let response = common_response;

    // Check if email is valid
    if (!validator.isEmail(email)) {
      response.success = false;
      response.message = 'Email must be a valid email address';
      return response;
    }

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      response.success = false;
      response.errorCode = 'USER_NOT_FOUND';
      return response;
    }

    try {
      // Generate a random password reset token
      const resetToken = randomBytes(32).toString('hex');
      console.log('Reset Password Token:', resetToken);

      // Set the expiration time for the token (1 hour from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      console.log('Expires At:', expiryDate);

      // Update user's status if needed
      user.statusVerify = "active";
      await this.userRepository.save(user); // Save user

      // Create and store the verification token
      await this.verificationService.createVerificationToken(user.id, resetToken, expiryDate);

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      console.log("Forgot Password process completed", user);

      // Response on success
      response.success = true;
      response.message = 'Password reset link sent!';
      response.token = resetToken;  // Token sent via email
      response.userId = user.id;    // User ID
    } catch (error) {
      response.success = false;
      response.message = 'Failed to process password reset';
      console.error('Error during password reset process:', error);
    }

    return response;
  }

  async resetPassword(resetPasswordToken: string, newPassword: string, newConfirmPassword: string) {
    let response = common_response;

    // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận không trùng khớp
    if (newPassword !== newConfirmPassword) {
      response.success = false;
      response.message = 'New password and confirmation password do not match.';
      return response;
    }

    console.log("Reset Token: ", resetPasswordToken);  // Kiểm tra token đã nhận

    // Tìm mã xác minh trong bảng Verification
    const verification = await this.tokenRepository.findOne({ where: { token: resetPasswordToken } });

    console.log('Verification:', verification);
    // Kiểm tra xem verification có tồn tại không
    if (!verification) {
      response.success = false;
      response.message = 'Invalid or expired reset token.';
      return response;
    }

    // Kiểm tra ngày hết hạn của token
    if (verification.expiresAt < new Date()) {
      response.success = false;
      response.message = 'Reset token has expired.';
      return response;
    }
    console.log('Expires At:', verification.expiresAt);

    // Tìm người dùng dựa trên userId từ verification
    const user = await this.userRepository.findOne({ where: { id: verification.userId } });
    if (!user) {
      response.success = false;
      response.message = 'User not found.';
      return response;
    }

    // Cập nhật mật khẩu cho người dùng
    user.password = await this.hashPassword(newPassword);
    await this.userRepository.save(user);

    // Xóa mã xác minh sau khi sử dụng (nếu cần)
    await this.verificationService.removeVerification(verification);

    response.success = true;
    response.message = 'Password changed successfully.';
    return response;
  }
}
