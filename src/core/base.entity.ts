import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"


export class Base {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt?: Date
}