import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginatorDto } from '../../core/paginator.dto'

export class QueryTeamDto extends PaginatorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  teamName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  budget?: number

  @ApiProperty({ required: false })
  @IsOptional()
  projectId?: number
}