import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  ForbiddenError,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user.role';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof User | typeof Booking> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'all');
    } else if (user.role === UserRole.OWNER) {
      can(Action.Read, 'all');
      can(Action.Create, Booking);
      can(Action.Delete, Booking);
      cannot(Action.Manage, User).because(
        'Owners are not authorized to manage user accounts.',
      );
    } else {
      can(Action.Read, Booking);
      can(Action.Create, Booking);
      can(Action.Delete, Booking, { userId: user.id });
      cannot(Action.Delete, Booking, { userId: { $ne: user.id } }).because(
        'Users can only delete their own bookings.',
      );
      cannot(Action.Manage, User).because(
        'Users are not authorized to manage user accounts.',
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  checkPermission(user: User, action: Action, subject: Subjects) {
    const ability = this.defineAbility(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
