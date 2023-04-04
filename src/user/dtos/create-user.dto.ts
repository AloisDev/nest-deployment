import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Base } from '../../core/base.entity';
import { RoleEnum } from '../../core/enums/role.enum';
import { CreateTeamDto } from '../../team/dto/create-team.dto';
import { Team } from '../../team/entities/team.entity';

export class CreateUserDto extends Base {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  userName: string | undefined;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: true, enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: string | undefined;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  teamId: number | undefined;

  @ApiProperty({ type: CreateTeamDto, required: false })
  @ValidateNested({ each: true })
  @Type(() => CreateTeamDto)
  @IsOptional()
  team?: Team;
}
