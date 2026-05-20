import Database from 'better-sqlite3';
import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { SCHEMA_SQL } from './schema';
import { SEED_SQL } from './seed';

function resolveDbPath() {
  const fromEnv = process.env.SQLITE_PATH || process.env.DATABASE_URL;
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'dichvuso.db');
}



export type DbUserRow = {
  id: number;
  email: string;
  passwordHash: string;
  name: string | null;
  role: string;
  isActive: 0 | 1;
  clerk_id: string | null;
  provider: string | null;
};

export type DbServiceRow = {
  id: number;
  name: string;
  slug: string;
  department: string;
  image: string | null;
  path: string;
  isActive: 0 | 1;
};

export type DbCategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: 0 | 1;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class DbService {
  private db: Database.Database;

  constructor() {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.ensureSchema();
  }

  private ensureSchema() {
    const hasUsersTable =
      (this.db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='users' LIMIT 1",
        )
        .get() as { name: string } | undefined) !== undefined;

    if (hasUsersTable) return;

    this.db.exec(SCHEMA_SQL);
    this.db.exec(SEED_SQL);
  }

  // auth
  findUserByEmail(email: string): DbUserRow | null {
    const row = this.db
      .prepare(
        `SELECT id, email, passwordHash, name, role, isActive
         FROM users
         WHERE lower(email) = lower(?)
         LIMIT 1`,
      )
      .get(email) as DbUserRow | undefined;
    return row ?? null;
  }

  findUserByClerkId(clerkId: string) {
    return this.db
      .prepare(`SELECT * FROM users WHERE clerk_id = ? LIMIT 1`)
      .get(clerkId);
  }

  createUserFromClerk(email: string, clerkId: string) {
    return this.db
      .prepare(
        `INSERT INTO users (email, clerk_id, provider, role, isActive)
         VALUES (?, ?, 'clerk', 'user', 1)`,
      )
      .run(email, clerkId);
  }

  updateClerkId(userId: number, clerkId: string) {
    return this.db
      .prepare(`UPDATE users SET clerk_id = ? WHERE id = ?`)
      .run(clerkId, userId);
  }

  // CATEGORIES

  /** Danh sách tất cả danh mục đang active */
  listCategories(): DbCategoryRow[] {
    return this.db
      .prepare(
        `SELECT c.id, c.name, c.slug, c.description, c.icon, c.isActive, c.createdAt, c.updatedAt,
        COUNT(sc.serviceId) AS serviceCount
        FROM categories c
        LEFT JOIN service_categories sc ON sc.categoryId = c.id
        WHERE c.isActive = 1
        GROUP BY c.id
        ORDER BY c.id ASC`
      )
      .all() as DbCategoryRow[];
  }

  findCategoryById(id: number): DbCategoryRow | null {
    return (this.db
      .prepare(
        `SELECT id, name, slug, description, icon, isActive, createdAt, updatedAt
       FROM categories WHERE id = ? LIMIT 1`
      )
      .get(id) as DbCategoryRow | undefined) ?? null;
  }

  findCategoryWithServices(idOrSlug: string | number): (DbCategoryRow & { services: DbServiceRow[] }) | null {
    const isId = typeof idOrSlug === 'number' || /^\d+$/.test(String(idOrSlug));

    const category = this.db
      .prepare(
        `SELECT id, name, slug, description, icon, [order], isActive, createdAt, updatedAt
         FROM categories
         WHERE ${isId ? 'id = ?' : 'slug = ?'} AND isActive = 1
         LIMIT 1`,
      )
      .get(isId ? Number(idOrSlug) : idOrSlug) as DbCategoryRow | undefined;

    if (!category) return null;

    const services = this.db
      .prepare(
        `SELECT s.id, s.name, s.slug, s.department, s.image, s.path, s.isActive
         FROM services s
         INNER JOIN service_categories sc ON sc.serviceId = s.id
         WHERE sc.categoryId = ? AND s.isActive = 1
         ORDER BY s.name ASC`,
      )
      .all(category.id) as DbServiceRow[];

    return { ...category, services };
  }

  // thêm danh mục dịch vụ
  createCategory(name: string): DbCategoryRow {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const now = new Date().toISOString();
    const result = this.db
      .prepare(
        `INSERT INTO categories (name, slug, createdAt, updatedAt)
         VALUES (?, ?, ?, ?)`,
      )
      .run(name, slug, now, now);
    return this.findCategoryWithServices(Number(result.lastInsertRowid)) as DbCategoryRow;
  }

  // sửa danh mục dịch vụ
  updateCategory(id: number, name: string, description?: string): DbCategoryRow | null {
    const cur = this.findCategoryById(id);
    if (!cur) return null;
    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    this.db
      .prepare(`UPDATE categories SET name=?, slug=?, description=?, updatedAt=? WHERE id=?`)
      .run(name, slug, description ?? cur.description, new Date().toISOString(), id);
    return this.findCategoryById(id);
  }

  // xoá danh mục
  deleteCategory(id: number): { deleted: boolean; reason?: string } {
    const used = (this.db
      .prepare(`SELECT COUNT(*) as cnt FROM service_categories WHERE categoryId = ?`)
      .get(id) as { cnt: number }).cnt;
    if (used > 0) return { deleted: false, reason: `Danh mục đang có ${used} dịch vụ, không thể xóa.` };
    const info = this.db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
    return { deleted: info.changes > 0 };
  }

  // services
  listServices() {
    const services = this.db
      .prepare(`SELECT id, name, slug, department, image, path, isActive FROM services WHERE isActive = 1 ORDER BY id ASC`)
      .all() as DbServiceRow[];

    const catStmt = this.db.prepare(
      `SELECT c.id, c.name, c.slug
     FROM categories c
     INNER JOIN service_categories sc ON sc.categoryId = c.id
     WHERE sc.serviceId = ?
     ORDER BY c.id ASC`
    );

    return services.map((s) => ({
      ...s,
      categories: catStmt.all(s.id) as { id: number; name: string; slug: string }[],
    }));
  }

  // hiển thị dịch vụ theo danh mục
  listServicesByCategory(categoryId: number) {
    const services = this.db
      .prepare(
        `SELECT s.id, s.name, s.slug, s.department, s.image, s.path, s.isActive
       FROM services s
       INNER JOIN service_categories sc ON sc.serviceId = s.id
       WHERE sc.categoryId = ? AND s.isActive = 1
       ORDER BY s.id ASC`
      )
      .all(categoryId) as DbServiceRow[];

    const catStmt = this.db.prepare(
      `SELECT c.id, c.name, c.slug
     FROM categories c
     INNER JOIN service_categories sc ON sc.categoryId = c.id
     WHERE sc.serviceId = ?
     ORDER BY c.id ASC`
    );

    return services.map((s) => ({
      ...s,
      categories: catStmt.all(s.id) as { id: number; name: string; slug: string }[],
    }));
  }

  //hiển thị dịch vụ phổ biến
  listPopularServices(limit = 6) {
    const services = this.db
      .prepare(
        `SELECT s.id, s.name, s.slug, s.department, s.image, s.path, s.isActive,
              COUNT(sv.id) AS visitCount
       FROM services s
       LEFT JOIN service_visits sv ON sv.serviceId = s.id
       WHERE s.isActive = 1
       GROUP BY s.id
       ORDER BY visitCount DESC
       LIMIT ?`
      )
      .all(limit) as (DbServiceRow & { visitCount: number })[];

    const catStmt = this.db.prepare(
      `SELECT c.id, c.name, c.slug
     FROM categories c
     INNER JOIN service_categories sc ON sc.categoryId = c.id
     WHERE sc.serviceId = ?
     ORDER BY c.id ASC`
    );

    return services.map((s) => ({
      ...s,
      categories: catStmt.all(s.id) as { id: number; name: string; slug: string }[],
    }));
  }

  //ghi lại số lần truy cập dịch vụ
  recordServiceVisit(serviceId: number, userId?: number, ip?: string, userAgent?: string) {
    this.db
      .prepare(
        `INSERT INTO service_visits (serviceId, userId, ip, userAgent, createdAt)
       VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .run(serviceId, userId ?? null, ip ?? null, userAgent ?? null);
  }

  //thêm danh mục mới
  createService(data: {
    name: string;
    department: string;
    image?: string;
    path: string;
    categoryIds: number[];
  }): DbServiceRow {
    const slug = data.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const now = new Date().toISOString();

    const result = this.db
      .prepare(
        `INSERT INTO services (name, slug, department, image, path, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`
      )
      .run(data.name, slug, data.department, data.image ?? null, data.path, now, now);

    const serviceId = Number(result.lastInsertRowid);

    // Gán danh mục
    const insertCat = this.db.prepare(
      `INSERT INTO service_categories (serviceId, categoryId) VALUES (?, ?)`
    );
    for (const categoryId of data.categoryIds) {
      insertCat.run(serviceId, categoryId);
    }

    return this.db
      .prepare(`SELECT id, name, slug, department, image, path, isActive FROM services WHERE id = ?`)
      .get(serviceId) as DbServiceRow;
  }

  // sửa dịch vụ
  updateService(id: number, data: {
    name?: string;
    department?: string;
    image?: string;
    path?: string;
    categoryIds?: number[];
    isActive?: 0 | 1
  }): DbServiceRow | null {
    const cur = this.db
      .prepare(`SELECT * FROM services WHERE id = ?`)
      .get(id) as DbServiceRow | undefined;
    if (!cur) return null;

    const name = data.name?.trim() ?? cur.name;
    const department = data.department?.trim() ?? cur.department;
    const image = data.image ?? cur.image;
    const path = data.path?.trim() ?? cur.path;
    const isActive = data.isActive ?? cur.isActive;
    const slug = data.name
      ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : cur.slug;

    this.db
      .prepare(
        `UPDATE services SET name=?, slug=?, department=?, image=?, path=?, isActive=?, updatedAt=? WHERE id=?`
      )
      .run(name, slug, department, image, path, isActive, new Date().toISOString(), id);

    // Cập nhật danh mục nếu có
    if (data.categoryIds?.length) {
      this.db.prepare(`DELETE FROM service_categories WHERE serviceId = ?`).run(id);
      const insertCat = this.db.prepare(
        `INSERT INTO service_categories (serviceId, categoryId) VALUES (?, ?)`
      );
      for (const categoryId of data.categoryIds) {
        insertCat.run(id, categoryId);
      }
    }

    return this.db
      .prepare(`SELECT id, name, slug, department, image, path, isActive FROM services WHERE id = ?`)
      .get(id) as DbServiceRow;
  }

  //xoá dịch vụ
  deleteService(id: number): { deleted: boolean; reason?: string } {
    const cur = this.db
      .prepare(`SELECT id FROM services WHERE id = ? LIMIT 1`)
      .get(id);
    if (!cur) return { deleted: false, reason: `Dịch vụ #${id} không tồn tại.` };

    // Xóa quan hệ danh mục trước
    this.db.prepare(`DELETE FROM service_categories WHERE serviceId = ?`).run(id);
    // Xóa lịch sử truy cập
    this.db.prepare(`DELETE FROM service_visits WHERE serviceId = ?`).run(id);
    // Xóa dịch vụ
    this.db.prepare(`DELETE FROM services WHERE id = ?`).run(id);

    return { deleted: true };
  }

  // Tổng lượt truy cập
  getTotalVisits(): number {
    return (this.db
      .prepare(`SELECT COUNT(*) as cnt FROM service_visits`)
      .get() as { cnt: number }).cnt;
  }

  // Dịch vụ mới nhất
  listRecentServices(limit = 5) {
    const services = this.db
      .prepare(
        `SELECT id, name, slug, department, image, path, isActive, createdAt
       FROM services
       WHERE isActive = 1
       ORDER BY createdAt DESC
       LIMIT ?`
      )
      .all(limit) as (DbServiceRow & { createdAt: string })[];

    const catStmt = this.db.prepare(
      `SELECT c.id, c.name, c.slug
     FROM categories c
     INNER JOIN service_categories sc ON sc.categoryId = c.id
     WHERE sc.serviceId = ?
     ORDER BY c.id ASC`
    );

    return services.map((s) => ({
      ...s,
      categories: catStmt.all(s.id) as { id: number; name: string; slug: string }[],
    }));
  }

  getFavorites(userId: number): DbServiceRow[] {
    return this.db
      .prepare(
        `SELECT s.id, s.name, s.slug, s.department, s.image, s.path, s.isActive
       FROM services s
       INNER JOIN user_favorites uf ON uf.serviceId = s.id
       WHERE uf.userId = ? AND s.isActive = 1
       ORDER BY uf.createdAt DESC`
      )
      .all(userId) as DbServiceRow[];
  }

  addFavorite(userId: number, serviceId: number) {
    const exists = this.db
      .prepare(`SELECT 1 FROM user_favorites WHERE userId=? AND serviceId=?`)
      .get(userId, serviceId);
    if (exists) return;
    this.db
      .prepare(`INSERT INTO user_favorites (userId, serviceId, createdAt) VALUES (?, ?, datetime('now'))`)
      .run(userId, serviceId);
  }

  removeFavorite(userId: number, serviceId: number) {
    this.db
      .prepare(`DELETE FROM user_favorites WHERE userId=? AND serviceId=?`)
      .run(userId, serviceId);
  }
} 