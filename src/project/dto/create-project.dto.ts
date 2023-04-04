import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Base } from '../../core/base.entity';

export class CreateProjectDto extends Base {
  @ApiProperty()
  @IsPositive()
  teamId!: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  projectName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  finishedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
