import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.role';

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async onApplicationBootstrap() {
    const count = await this.userRepo.count();
    if (count > 0) return;

    const name = process.env.SEED_USER_NAME?.trim() || 'admin';
    const roleRaw = process.env.SEED_USER_ROLE?.trim().toLowerCase();
    const role = (Object.values(UserRole) as string[]).includes(roleRaw ?? '')
      ? (roleRaw as UserRole)
      : UserRole.ADMIN;

    const user = this.userRepo.create({ name, role });
    await this.userRepo.save(user);

    this.logger.log(`Seeded initial user: ${name} (${role})`);
  }
}
