import { Controller, Get, Post, Body, Patch, Delete, Req, UseGuards, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DbService } from '../db/db.service';
import { ClerkAuthGuard } from '../auth/clerk.guard';
import { UsersService } from '../users/users.service';
import { Service } from './services.service';


@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly db: DbService,
    private readonly usersService: UsersService,
    private readonly service: Service,
  ) { }

  @UseGuards(ClerkAuthGuard)
  @Get('test-images')
  @ApiOperation({ summary: 'Lấy dịch vụ để test hình ảnh' })
  getForImageTest(@Req() req: Request) {
    const clerkUser = (req as any).user;

    //sync user
    const user = this.usersService.syncClerkUser(clerkUser);
    const rows = this.db.listServices();
    const origin = `${req.protocol}://${req.get('host')}`;

    const data = rows.map((x) => {
      let imageUrl: string | null = x.image ?? null;
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        imageUrl = imageUrl.startsWith('/')
          ? `${origin}${imageUrl}`
          : `${origin}/assets/png/${imageUrl}`;
      }

      return {
        id: x.id,
        name: x.name,
        department: x.department,
        image: x.image,
        imageUrl,
        serviceUrl: x.path,
      };
    });

    return {
      user,
      total: data.length,
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả dịch vụ' })
  getAll(@Req() req: Request) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.service.findAll(origin);
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Dịch vụ theo danh mục' })
  getByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: Request,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.service.findByCategory(categoryId, origin);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Dịch vụ phổ biến' })
  getPopular(
    @Req() req: Request,
    @Query('limit') limit?: string,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.service.findPopular(origin, limit ? Number(limit) : 6);
  }

  @Post(':id/visit')
  @ApiOperation({ summary: 'Ghi nhận lượt truy cập' })
  recordVisit(
    @Param('id', ParseIntPipe) serviceId: number,
    @Req() req: Request,
  ) {
    const ip = req.ip;
    const useAgent = req.headers['user-agent'];
    return this.service.recordVisit(serviceId, ip, useAgent);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  create(@Body() body: {
    name: string;
    department: string;
    image?: string;
    path: string;
    categoryIds: number[];
  }) {
    return this.service.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      name?: string;
      department?: string;
      image?: string;
      path?: string;
      categoryIds?: number[];
      isActive?: boolean;
    },
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('stats/total')
  @ApiOperation({ summary: 'Tổng số dịch vụ' })
  getTotal() {
    return this.service.getTotal();
  }

  @Get('stats/visits')
  @ApiOperation({ summary: 'Tổng lượt truy cập' })
  getTotalVisits() {
    return this.service.getTotalVisits();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Dịch vụ gần đây' })
  getRecent(@Query('limit') limit?: string) {
    return this.service.findRecent(limit ? Number(limit) : 5);
  }
}
