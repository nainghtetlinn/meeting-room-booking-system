import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfter } from 'src/decorators/is-after.decorator';

export class CreateBookingDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(), { message: 'Booking cannot be in the past' })
  startTime!: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsAfter('startTime', { message: 'endTime must be after startTime' })
  endTime!: Date;
}
