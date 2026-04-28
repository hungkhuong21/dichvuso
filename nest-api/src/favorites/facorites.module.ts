import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
    imports: [DbModule],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule { }