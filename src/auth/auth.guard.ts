import {Injectable, CanActivate, ExecutionContext, UnauthorizedException,} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bạn chưa cung cấp token');
    }

    try {
      await firstValueFrom(
        this.httpService.get(
          `${process.env.AUTH_SERVICE_URL}/auth`,
          {
            headers: {
              Authorization: auth,
            },
          },
        ),
      );

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc đã hết hạn',
      );
    }
  }
}
