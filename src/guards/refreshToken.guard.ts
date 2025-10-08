import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.extractRefreshTokenFromRequest(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      request.user = payload;
      request.refreshToken = refreshToken;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return true;
  }

  private extractRefreshTokenFromRequest(request: Request): string | undefined {
    // You can get refresh token from body or cookie
    return request.body.refreshToken || request.cookies?.refreshToken;
  }
}
