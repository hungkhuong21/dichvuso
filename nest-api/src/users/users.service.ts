import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}

  syncClerkUser(clerkUser: any) {
    let user = this.db.findUserByEmail(clerkUser.email);

    if (!user) {
      this.db.createUserFromClerk(clerkUser.email, clerkUser.clerkId);
      user = this.db.findUserByEmail(clerkUser.email);
    } else if (!user.clerk_id) {
      this.db.updateClerkId(user.id, clerkUser.clerkId);
    }

    return user;
  }
}