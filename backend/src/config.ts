import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('DB_URL')
  @IsNotEmpty()
  database_url!: string;
}
