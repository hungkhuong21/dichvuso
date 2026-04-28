import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { FavoritesModule } from './favorites/facorites.module';

@Module({
  imports: [AuthModule, ServicesModule, CategoriesModule, UploadModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
