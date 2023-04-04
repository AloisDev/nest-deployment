import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginatorDto } from '../../core/paginator.dto'

export class QueryEpicDto extends PaginatorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  epicName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  budget?: number

  @ApiProperty({ required: false })
  @IsOptional()
  projectId?: number
}