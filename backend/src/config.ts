import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('DB_HOST')
  @IsNotEmpty()
  host!: string;

  @Value('DB_PORT', {
    parse: parseInt,
  })
  @IsNumber()
  @IsNotEmpty()
  port!: number;

  @Value('DB_USERNAME')
  @IsNotEmpty()
  username!: string;

  @Value('DB_PASSWORD')
  @IsNotEmpty()
  password!: string;

  @Value('DB_DATABASE')
  @IsNotEmpty()
  database!: string;
}
