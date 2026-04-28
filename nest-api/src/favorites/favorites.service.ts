import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DbService) {}

  getAll(userId: number) {
    return this.db.getFavorites(userId);
  }

  add(userId: number, serviceId: number) {
    this.db.addFavorite(userId, serviceId);
    return { success: true };
  }

  remove(userId: number, serviceId: number) {
    this.db.removeFavorite(userId, serviceId);
    return { success: true };
  }
}