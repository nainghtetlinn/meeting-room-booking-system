import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException(
        'No user ID provided in x-user-id header',
      );
    }

    const user = await this.userRepo.findOneBy({
      id: Number(userId),
    });
    if (!user) {
      throw new UnauthorizedException('Invalid User ID');
    }

    request.user = user;
    return true;
  }
}
