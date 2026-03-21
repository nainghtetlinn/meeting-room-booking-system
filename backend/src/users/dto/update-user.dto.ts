import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.role';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}
