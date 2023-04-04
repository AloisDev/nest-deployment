import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../core/base.entity';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  orderBy: {
    id: 'ASC',
  },
})
export class Team extends Base {
  @ApiProperty({ required: true })
  @Column({ nullable: true })
  teamName?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, default: 0.0 })
  budget!: number;

  @ApiProperty()
  @Column({ nullable: true })
  projectId!: number;

  @OneToMany((type) => Project, (project) => project.team)
  projects!: Project[];

  @OneToMany((type) => User, (user) => user.team)
  users!: User[];
}
