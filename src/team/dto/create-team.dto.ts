import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Base } from '../../core/base.entity';

export class CreateTeamDto extends Base {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  teamName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  budget?: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  projectId?: number;
}
