import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../core/base.entity';
import { Epic } from '../../epic/entities/epic.entity';
import { Team } from '../../team/entities/team.entity';

@Entity({
  orderBy: {
    id: 'ASC',
  },
})
export class Project extends Base {
  @ApiProperty({ type: () => Team })
  @ManyToOne((type) => Team, (team) => team.projects, { nullable: false })
  team!: Team;

  @ApiProperty()
  @Column({ nullable: false })
  teamId!: number;

  @ApiProperty({ required: true })
  @Column({ nullable: false })
  projectName!: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamptz', nullable: true, default: null })
  finishedAt!: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'boolean', default: false, nullable: true })
  completed!: boolean;

  @ApiProperty({ type: () => Epic, isArray: true })
  @OneToMany((type) => Epic, (epic) => epic.project)
  epics!: Epic[];
}
