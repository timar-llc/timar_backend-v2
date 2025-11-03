import { CreateRespondDto } from './create-respond.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateRespondDto extends OmitType(PartialType(CreateRespondDto), [
  'taskUuid',
]) {}
