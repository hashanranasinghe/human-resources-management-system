import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('inside the auth guard');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTOkenFromHeader(request);

    console.log(token);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload.user;
    } catch (e) {
      Logger.error(e.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTOkenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
