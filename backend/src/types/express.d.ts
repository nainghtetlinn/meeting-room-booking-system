import { User } from 'src/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
