import { Controller, Get, Post, Delete, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly svc: FavoritesService) { }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách yêu thích' })
    getAll(@Req() req: any) {
        return this.svc.getAll(req.user.id);
    }

    @Post(':serviceId')
    @ApiOperation({ summary: 'Thêm yêu thích' })
    add(@Req() req: any, @Param('serviceId', ParseIntPipe) serviceId: number) {
        return this.svc.add(req.user.id, serviceId);
    }

    @Delete(':serviceId')
    @ApiOperation({ summary: 'Bỏ yêu thích' })
    remove(@Req() req: any, @Param('serviceId', ParseIntPipe) serviceId: number) {
        return this.svc.remove(req.user.id, serviceId);
    }
}