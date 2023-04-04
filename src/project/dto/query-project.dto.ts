import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { PaginatorDto } from '../../core/paginator.dto'

export class QueryProjectDto extends PaginatorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  projectName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  teamId?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  completed?: boolean
}