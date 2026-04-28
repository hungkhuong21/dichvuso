import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly db: DbService) {}

  private getJwtSecret() {
    return process.env.AUTH_JWT_SECRET || 'dev-only-change-me';
  }

  private async verifyPassword(password: string, passwordHash: string) {
    if (!passwordHash) return false;
    if (
      passwordHash.startsWith('$2a$') ||
      passwordHash.startsWith('$2b$') ||
      passwordHash.startsWith('$2y$')
    ) {
      return bcrypt.compare(password, passwordHash);
    }
    return password === passwordHash;
  }

  async login(emailRaw: string, password: string) {
    const email = (emailRaw || '').trim().toLowerCase();
    if (!email || !password) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const row = this.db.findUserByEmail(email);
    if (!row || row.isActive !== 1) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const ok = await this.verifyPassword(password, row.passwordHash);
    if (!ok) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const user: AuthUser = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
    };

    const access_token = jwt.sign(
      { sub: String(user.id), email: user.email, name: user.name, role: user.role },
      this.getJwtSecret(),
      { expiresIn: '7d' },
    );

    return { access_token, user };
  }
}

