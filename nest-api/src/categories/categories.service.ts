import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: DbService) { }

  /** GET /categories */
  findAll() {
    return this.db.listCategories();
  }

  /** GET /categories/:idOrSlug */
  findOne(idOrSlug: string) {
    const result = this.db.findCategoryWithServices(idOrSlug);
    if (!result) {
      throw new NotFoundException(`Danh mục "${idOrSlug}" không tồn tại.`);
    }
    return result;
  }

  /** GET /categories/:idOrSlug/services */
  findServices(idOrSlug: string) {
    return this.findOne(idOrSlug).services;
  }

  /** POST /categories (thêm mới) */
  create(body: { name: string }) {
    const { name } = body;
    if (!name?.trim()) {
      throw new NotFoundException(`Tên danh mục không được để trống.`);
    }
    return this.db.createCategory(name.trim());
  }

  /** PATCH /categories/:id */
  update(id: number, body: { name?: string; description?: string }) {
    const cur = this.db.findCategoryById(id);
    if (!cur) throw new NotFoundException(`Danh mục #${id} không tồn tại.`);
    return this.db.updateCategory(
      id,
      body.name?.trim() ?? cur.name,
      body.description?.trim(),
    );
  }

  /** DELETE /categories/:id */
  delete(id: number) {
    const cur = this.db.findCategoryById(id);
    if (!cur) throw new NotFoundException(`Danh mục #${id} không tồn tại.`);
    const result = this.db.deleteCategory(id);
    if (!result.deleted) throw new ConflictException(result.reason);
    return { success: true };
  }
}