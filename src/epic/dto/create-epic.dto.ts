import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Base } from '../../core/base.entity';

export class CreateEpicDto extends Base {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  epicName!: string;
}
