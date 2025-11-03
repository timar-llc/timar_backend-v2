import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  JwtResponseDto,
  LoginDto,
  LoginWithEmailDto,
  LoginWithPhoneDto,
  RefreshDto,
} from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';
import {
  ConfirmCodeType,
  ConfirmDto,
  ConfirmWithNumberDto,
} from './dto/confirm.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { SocialAuthDto, SocialProvider } from './dto/social-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<JwtResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<JwtResponseDto> {
    return await this.authService.refresh(refreshDto);
  }
  @Post('login/phone')
  async loginWithPhone(
    @Body() loginDto: LoginWithPhoneDto,
  ): Promise<StatusOkDto> {
    return await this.authService.loginWithPhone(loginDto);
  }
  @Post('login/phone/code')
  async confirmPhoneLogin(
    @Body() loginDto: ConfirmWithNumberDto,
  ): Promise<JwtResponseDto> {
    return await this.authService.confirmPhoneLogin(
      loginDto.phoneNumber,
      loginDto.code,
    );
  }

  @Post('login/email')
  async loginWithEmail(
    @Body() loginDto: LoginWithEmailDto,
  ): Promise<JwtResponseDto> {
    return await this.authService.loginWithEmail(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<StatusOkDto> {
    return await this.authService.register(registerDto);
  }

  @Post('confirm')
  async confirm(
    @Body() confirmDto: ConfirmDto,
    @Query() confirmCodeType: ConfirmCodeType,
  ): Promise<StatusOkDto> {
    return await this.authService.confirm(confirmDto, confirmCodeType);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<StatusOkDto> {
    return await this.authService.resetPassword(body);
  }

  @Post('set-new-password')
  async setNewPassword(@Body() body: SetNewPasswordDto): Promise<StatusOkDto> {
    return await this.authService.setNewPassword(body);
  }
  @Post('social-auth')
  async socialAuth(
    @Body() body: SocialAuthDto,
    @Query() provider: SocialProvider,
  ): Promise<JwtResponseDto> {
    return await this.authService.socialAuth(body, provider);
  }
}
