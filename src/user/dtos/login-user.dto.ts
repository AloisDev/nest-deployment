import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userName!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
