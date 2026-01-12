import { PartialType, OmitType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'username',
  'specialization',
  'cv',
  'phoneNumber',
  'technologies',
] as const) {}
