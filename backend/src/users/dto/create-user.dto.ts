import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.role';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role?: UserRole;
}
