import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginatorDto {
  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = +(process.env.DEFAULT_PAGE || 1);

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Max(+(process.env.MAX_PAGE_LIMIT || 100))
  @Min(+(process.env.MIN_PAGE_LIMIT || 10))
  limit?: number = +(process.env.DEFAULT_PAGE_LIMIT || 10);
}
