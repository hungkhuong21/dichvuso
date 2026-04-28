import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class Service {
  constructor(private readonly db: DbService) { }

  /** GET /services */
  findAll(origin: string) {
    const rows = this.db.listServices();
    const data = rows.map((s) => {
      let imageUrl: string | null = s.image ?? null;
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        imageUrl = imageUrl.startsWith('/')
          ? `${origin}${imageUrl}`
          : `${origin}/assets/png/${imageUrl}`;
      }
      return { ...s, imageUrl };
    });
    return { total: data.length, data };
  }

  findByCategory(categoryId: number, origin: string) {
    const rows = this.db.listServicesByCategory(categoryId);
    const data = rows.map((s) => {
      let imageUrl: string | null = s.image ?? null;
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        imageUrl = imageUrl.startsWith('/')
          ? `${origin}${imageUrl}`
          : `${origin}/assets/png/${imageUrl}`;
      }
      return { ...s, imageUrl };
    });
    return { total: data.length, data };
  }

  findPopular(origin: string, limit = 6) {
    const rows = this.db.listPopularServices(limit);
    const data = rows.map((s) => {
      let imageUrl: string | null = s.image ?? null;
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        imageUrl = imageUrl.startsWith('/')
          ? `${origin}${imageUrl}`
          : `${origin}/assets/png/${imageUrl}`;
      }
      return { ...s, imageUrl };
    });
    return { total: data.length, data };
  }

  recordVisit(serviceId: number, ip?: string, useAgent?: string) {
    this.db.recordServiceVisit(serviceId, undefined, ip, useAgent);
    return { success: true };
  }

  // thêm danh mục
  create(data: {
    name: string;
    department: string;
    image?: string;
    path: string;
    categoryIds: number[];
  }) {
    if (!data.name?.trim()) throw new BadRequestException('Tên dịch vụ không được để trống.');
    if (!data.path?.trim()) throw new BadRequestException('Link dịch vụ không được để trống.');
    if (!data.categoryIds?.length) throw new BadRequestException('Phải chọn ít nhất 1 danh mục.');
    return this.db.createService({
      ...data,
      name: data.name.trim(),
      path: data.path.trim(),
    });
  }

  update(id: number, data: {
    name?: string;
    department?: string;
    image?: string;
    path?: string;
    categoryIds?: number[];
    isActive?: boolean;
  }) {
    const result = this.db.updateService(id, {
      ...data,
      isActive: data.isActive !== undefined ? (data.isActive ? 1 : 0) : undefined,
    });
    if (!result) throw new NotFoundException(`Dịch vụ #${id} không tồn tại.`);
    return result;
  }

  remove(id: number) {
  const result = this.db.deleteService(id);
  if (!result.deleted) throw new NotFoundException(result.reason);
  return { success: true };
}

getTotal() {
  return { total: this.db.listServices().length };
}

getTotalVisits() {
  return { totalVisits: this.db.getTotalVisits() };
}

findRecent(limit = 5) {
  return this.db.listRecentServices(limit);
}
}