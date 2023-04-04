import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../core/base.entity';
import { Project } from '../../project/entities/project.entity';

@Entity({
  orderBy: {
    id: 'ASC',
  },
})
export class Epic extends Base {
  @ApiProperty({ type: () => Epic })
  @ManyToOne((type) => Project, (project) => project.epics, { nullable: false })
  project!: Project;

  @ApiProperty({ required: true })
  @Column({ nullable: false })
  projectId!: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  epicName?: string;
}
