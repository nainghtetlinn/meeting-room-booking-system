import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AbilityModule } from 'src/ability/ability.module';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AbilityModule],
  controllers: [UsersController],
  providers: [UsersService, UserSeedService],
  exports: [UsersService],
})
export class UsersModule {}
