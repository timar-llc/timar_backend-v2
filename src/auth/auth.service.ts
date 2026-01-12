import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  JwtResponseDto,
  LoginDto,
  LoginWithPhoneDto,
  RefreshDto,
} from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/config/redis/redis.service';
import { MailerService } from 'src/config/mailer/mailer.service';
import { StatusOkDto } from 'src/common/dto/success.dto';
import {
  ConfirmCodeType,
  ConfirmCodeTypeEnum,
  ConfirmWithEmailDto,
  ConfirmWithNumberDto,
  ConfirmDto,
} from './dto/confirm.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { SmsService } from 'src/config/sms/sms.service';
import { LoginWithEmailDto } from './dto/login.dto';
import { SocialAuthDto, SocialProvider } from './dto/social-auth.dto';
import { AchievementsService } from 'src/achievements/achievements.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
    private readonly achievementsService: AchievementsService,
    private readonly notificationsService: NotificationsService,
  ) {}
  async login(loginDto: LoginDto): Promise<JwtResponseDto> {
    let user: User | null = null;
    if (loginDto.phoneNumber) {
      user = await this.userRepository.findOne({
        where: { phoneNumber: loginDto.phoneNumber },
      });
    } else if (loginDto.email) {
      user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user?.uuid, email: user?.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async loginWithPhone(loginDto: LoginWithPhoneDto): Promise<StatusOkDto> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: loginDto.phoneNumber },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.smsService.sendLoginSms(loginDto.phoneNumber, loginCode);
    await this.redisService.set(
      `login:${loginDto.phoneNumber}`,
      JSON.stringify({
        phoneNumber: loginDto.phoneNumber,
        code: loginCode,
        userUuid: user.uuid,
      }),
      600, // 10 минут TTL
    );
    return new StatusOkDto();
  }
  async confirmPhoneLogin(
    phoneNumber: string,
    code: string,
  ): Promise<JwtResponseDto> {
    const existingUserInRedis = await this.redisService.get(
      `login:${phoneNumber}`,
    );
    if (!existingUserInRedis) {
      throw new BadRequestException('Invalid code');
    }
    const { code: redisCode, userUuid } = JSON.parse(existingUserInRedis);
    if (code !== redisCode) {
      throw new BadRequestException('Invalid code');
    }
    await this.redisService.del(`login:${phoneNumber}`);
    const payload = { sub: userUuid };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  async loginWithEmail(loginDto: LoginWithEmailDto): Promise<JwtResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const payload = { sub: user?.uuid, email: user?.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto): Promise<StatusOkDto> {
    const { email, phoneNumber, password } = registerDto;
    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }
    const passwordHash = await bcrypt.hash(password, 10);

    if (email) {
      const existingUserInRedis = await this.redisService.get(
        `registration:${email}`,
      );
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUserInRedis || existingUser) {
        throw new BadRequestException('User already registered');
      }
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.mailerService.sendRegistrationEmail(email, confirmationCode);
      await this.redisService.set(
        `registration:${email}`,
        JSON.stringify({ email, passwordHash, code: confirmationCode }),
        600,
      );
      return new StatusOkDto();
    }

    if (phoneNumber) {
      const existingUserInRedis = await this.redisService.get(
        `registration:${phoneNumber}`,
      );
      const existingUser = await this.userRepository.findOne({
        where: { phoneNumber },
      });
      if (existingUserInRedis || existingUser) {
        throw new BadRequestException('User already registered');
      }
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.smsService.sendRegistrationSms(phoneNumber, confirmationCode);
      await this.redisService.set(
        `registration:${phoneNumber}`,
        JSON.stringify({ phoneNumber, passwordHash, code: confirmationCode }),
        600,
      );
      return new StatusOkDto();
    }

    throw new InternalServerErrorException();
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<StatusOkDto> {
    const { email, phoneNumber } = resetPasswordDto;
    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    if (email) {
      const existingUserInRedis = await this.redisService.get(
        `reset-password:${email}`,
      );
      if (existingUserInRedis) {
        throw new BadRequestException(
          'Reset password code already sent, please wait',
        );
      }
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.mailerService.sendResetPasswordEmail(email, confirmationCode);
      await this.redisService.set(
        `reset-password:${email}`,
        JSON.stringify({
          email,
          code: confirmationCode,
          userUuid: existingUser.uuid,
        }),
        600,
      );
      return new StatusOkDto();
    }

    if (phoneNumber) {
      const existingUserInRedis = await this.redisService.get(
        `reset-password:${phoneNumber}`,
      );
      if (existingUserInRedis) {
        throw new BadRequestException(
          'Reset password code already sent, please wait',
        );
      }
      const existingUser = await this.userRepository.findOne({
        where: { phoneNumber },
      });
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.smsService.sendResetPasswordSms(phoneNumber, confirmationCode);
      await this.redisService.set(
        `reset-password:${phoneNumber}`,
        JSON.stringify({
          phoneNumber,
          code: confirmationCode,
          userUuid: existingUser.uuid,
        }),
        600,
      );
      return new StatusOkDto();
    }

    throw new InternalServerErrorException();
  }

  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
  ): Promise<StatusOkDto> {
    const { email, phoneNumber, password } = setNewPasswordDto;
    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }
    let user: User | null = null;
    if (email) {
      user = await this.userRepository.findOne({ where: { email } });
    } else if (phoneNumber) {
      user = await this.userRepository.findOne({ where: { phoneNumber } });
    }
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await this.userRepository.update(user.uuid, { passwordHash });
    return new StatusOkDto();
  }

  async confirm(
    confirmDto: ConfirmDto,
    confirmCodeType: ConfirmCodeType,
  ): Promise<StatusOkDto> {
    const { type } = confirmCodeType;
    if (type === ConfirmCodeTypeEnum.REGISTER) {
      if ((confirmDto as any).email) {
        const { email, code } = confirmDto as ConfirmWithEmailDto;
        return await this.confirmRegister(email, code);
      } else if ((confirmDto as any).phoneNumber) {
        const { phoneNumber, code } = confirmDto as ConfirmWithNumberDto;
        return await this.confirmRegisterByPhone(phoneNumber, code);
      }
      throw new BadRequestException('Email or phone number is required');
    } else if (type === ConfirmCodeTypeEnum.RESET_PASSWORD) {
      if ((confirmDto as any).email) {
        const { email, code } = confirmDto as ConfirmWithEmailDto;
        return await this.confirmResetPasswordByEmail(email, code);
      } else if ((confirmDto as any).phoneNumber) {
        const { phoneNumber, code } = confirmDto as ConfirmWithNumberDto;
        return await this.confirmResetPasswordByPhone(phoneNumber, code);
      }
      throw new BadRequestException('Email or phone number is required');
    } else {
      throw new InternalServerErrorException();
    }
  }

  async confirmRegister(email: string, code: string): Promise<StatusOkDto> {
    const existingUserInRedis = await this.redisService.get(
      `registration:${email}`,
    );
    if (!existingUserInRedis) {
      throw new BadRequestException('Invalid code');
    }
    const { code: redisCode, passwordHash } = JSON.parse(existingUserInRedis);
    if (code !== redisCode) {
      throw new BadRequestException('Invalid code');
    }
    await this.redisService.del(`registration:${email}`);
    const user = await this.userRepository.save({
      email,
      emailConfirmed: true,
      passwordHash,
    });
    await this.achievementsService.initUserAchievements(user.uuid);
    await this.notificationsService.createInitNotification(user.uuid);
    return new StatusOkDto();
  }

  async confirmRegisterByPhone(
    phoneNumber: string,
    code: string,
  ): Promise<StatusOkDto> {
    const existingUserInRedis = await this.redisService.get(
      `registration:${phoneNumber}`,
    );
    if (!existingUserInRedis) {
      throw new BadRequestException('Invalid code');
    }
    const { code: redisCode, passwordHash } = JSON.parse(existingUserInRedis);
    if (code !== redisCode) {
      throw new BadRequestException('Invalid code');
    }
    await this.redisService.del(`registration:${phoneNumber}`);
    const user = await this.userRepository.save({
      phoneNumber,
      passwordHash,
    });
    await this.achievementsService.initUserAchievements(user.uuid);
    await this.notificationsService.createInitNotification(user.uuid);
    return new StatusOkDto();
  }

  async confirmResetPasswordByEmail(
    email: string,
    code: string,
  ): Promise<StatusOkDto> {
    const existingUserInRedis = await this.redisService.get(
      `reset-password:${email}`,
    );
    if (!existingUserInRedis) {
      throw new BadRequestException('Invalid code');
    }
    const { code: redisCode } = JSON.parse(existingUserInRedis);
    if (code !== redisCode) {
      throw new BadRequestException('Invalid code');
    }
    await this.redisService.del(`reset-password:${email}`);
    return new StatusOkDto();
  }

  async confirmResetPasswordByPhone(
    phoneNumber: string,
    code: string,
  ): Promise<StatusOkDto> {
    const existingUserInRedis = await this.redisService.get(
      `reset-password:${phoneNumber}`,
    );
    if (!existingUserInRedis) {
      throw new BadRequestException('Invalid code');
    }
    const { code: redisCode } = JSON.parse(existingUserInRedis);
    if (code !== redisCode) {
      throw new BadRequestException('Invalid code');
    }
    await this.redisService.del(`reset-password:${phoneNumber}`);
    return new StatusOkDto();
  }
  async socialAuth(
    socialAuthDto: SocialAuthDto,
    provider: SocialProvider,
  ): Promise<JwtResponseDto> {
    const providerSelector = {
      telegram: 'telegramId',
      google: 'googleId',
      github: 'githubId',
    };
    let user = await this.userRepository.findOne({
      where: [
        { [providerSelector[provider.provider]]: socialAuthDto.id },
        { email: socialAuthDto.email },
      ],
    });
    if (!user) {
      user = await this.userRepository.save({
        [providerSelector[provider.provider]]: socialAuthDto.id,
        firstName: socialAuthDto.firstName,
        email: socialAuthDto.email,
        passwordHash: await bcrypt.hash(socialAuthDto.id, 10),
        avatarUrl: socialAuthDto.avatar,
      });
      await this.achievementsService.initUserAchievements(user.uuid);
    await this.notificationsService.createInitNotification(user.uuid);
    }
    const payload = { sub: user?.uuid, email: user?.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto): Promise<JwtResponseDto> {
    const { refreshToken } = refreshDto;
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const payload = { sub: decoded.sub, email: decoded.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
    let newRefreshToken = refreshToken;
    newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken: newRefreshToken };
  }
}
