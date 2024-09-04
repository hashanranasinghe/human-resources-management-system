import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AutherizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('inside the autherization guard');
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log(requiredRoles);
    const token = this.extractTOkenFromHeader(request);

    const payload = this.jwtService.verify(token);

    const userRole = payload.userRole;
    if (requiredRoles !== userRole) return false;
    return true;
  }
  private extractTOkenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
