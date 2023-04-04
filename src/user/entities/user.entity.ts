import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../core/base.entity';
import { Team } from '../../team/entities/team.entity';

@Entity({
  orderBy: {
    id: 'ASC',
  },
})
export class User extends Base {
  @ApiProperty({ type: () => Team })
  @ManyToOne((type) => Team, (team) => team.users, { nullable: true })
  team?: Team;

  @ApiProperty({ required: true })
  @Column({ nullable: false })
  userName!: string;

  @ApiProperty({ required: true })
  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  role?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'boolean', default: false })
  isActive?: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  teamId?: number;
}
