import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả danh mục' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Chi tiết danh mục + dịch vụ' })
  @ApiParam({ name: 'idOrSlug', example: 'sinh-vien' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.categoriesService.findOne(idOrSlug);
  }

  @Get(':idOrSlug/services')
  @ApiOperation({ summary: 'Chỉ lấy dịch vụ của một danh mục' })
  @ApiParam({ name: 'idOrSlug', example: '5' })
  findServices(@Param('idOrSlug') idOrSlug: string) {
    return this.categoriesService.findServices(idOrSlug);
  }

  // POST /categories 
  @Post()
  @ApiOperation({ summary: 'Thêm mới danh mục' })
  @ApiBody({ schema: { example: { name: 'Tên danh mục mới' } } })
  create(@Body() body: { name: string }) {
    return this.categoriesService.create(body);
  }

  // PATCH /categories/:id 
  @Patch(':id')
  @ApiOperation({ summary: 'Sửa danh mục' })
  @ApiParam({ name: 'id', example: 5 })
  @ApiBody({ schema: { example: { name: 'Tên mới', description: 'Mô tả mới' } } })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.categoriesService.update(id, body);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiParam({ name: 'id', example: 5 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}