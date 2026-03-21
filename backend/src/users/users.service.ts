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

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.userRepo.findOneBy({ name: createUserDto.name });
    if (exists) throw new BadRequestException('User already exists');

    return this.userRepo.save(createUserDto);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    return this.userRepo.remove(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    user.role = updateUserDto.role;
    return this.userRepo.save(user);
  }

  findAll() {
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
