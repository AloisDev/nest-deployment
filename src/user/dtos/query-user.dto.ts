import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { RoleEnum } from '../../core/enums/role.enum';
import { PaginatorDto } from '../../core/paginator.dto';

export class QueryUserDto extends PaginatorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiProperty({ enum: RoleEnum, required: false })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  teamId?: number;
}
