import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('inside the authorization guard');
    const request = context.switchToHttp().getRequest();
    const requiredRoles: string[] = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new UnauthorizedException();
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token);
      const userRole = payload.userRole;

      if (!requiredRoles.includes(userRole)) {
        return false;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
