import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @Post()
  create(@GetUser() user: User, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: number) {
    return this.usersService.remove(id, user);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @ApiOperation({ summary: 'View all users' })
  @Get()
  findAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @ApiOperation({ summary: 'List of users to login' })
  @Public()
  @Get('/list')
  listUsers() {
    return this.usersService.listUsers();
  }
}
