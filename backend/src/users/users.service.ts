import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AbilityFactory, Action } from 'src/ability/ability.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private abilityFactory: AbilityFactory,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser: User) {
    this.abilityFactory.checkPermission(currentUser, Action.Create, User);

    const exists = await this.userRepo.findOneBy({ name: createUserDto.name });
    if (exists) throw new BadRequestException('User already exists');

    return this.userRepo.save(createUserDto);
  }

  async remove(id: number, currentUser: User) {
    this.abilityFactory.checkPermission(currentUser, Action.Delete, User);

    const user = await this.findById(id);
    return this.userRepo.remove(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    this.abilityFactory.checkPermission(currentUser, Action.Update, User);
    const user = await this.findById(id);
    user.role = updateUserDto.role;
    return this.userRepo.save(user);
  }

  findAll(currentUser: User) {
    this.abilityFactory.checkPermission(currentUser, Action.Read, User);
    return this.userRepo.find();
  }

  async findById(id: number) {
    const user = await this.userRepo.findOneBy({
      id,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
