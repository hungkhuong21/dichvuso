import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyToken(token, {
        secretKey: 'pk_test_Y2hhcm1lZC1zb2xlLTUuY2xlcmsuYWNjb3VudHMuZGV2JA',
        issuer: "https://dashboard.clerk.com/apps/app_3BKLHYyla3mRDqVTXrwBkG8AP1V/instances/ins_3BKLHX4MGUZCsW8O77SppGUQ7Dh/api-keys",
      });

      req.user = {
        clerkId: payload.sub,
      };

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Invalid Clerk token');
    }
  }
}