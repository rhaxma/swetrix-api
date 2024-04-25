import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from '../../project/entity'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './repositories/projects.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [ProjectsRepository],
})
export class ProjectsModule {}
