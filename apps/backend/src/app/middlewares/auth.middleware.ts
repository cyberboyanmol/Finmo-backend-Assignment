import {
  NestMiddleware,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CryptoService } from '@forexsystem/helpers/auth/crypto.service';
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user: { user_id: string };
}

export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger(AuthMiddleware.name);
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    try {
      if (!authorization) {
        throw new UnauthorizedException();
      }

      const [bearer, token] = authorization?.split(' ') || [];

      if (bearer !== 'Bearer' || !token) {
        throw new Error(
          'Invalid authorization header format. Format is "Bearer <token>".'
        );
      }

      const { user_id } = CryptoService.verifyAccessToken(token);

      if (!user_id) {
        throw new UnauthorizedException();
      }

      req.user = { user_id };
      next();
      return;
    } catch (err) {
      this.logger.error(err);
      let errorMessage;

      switch (true) {
        case err instanceof JsonWebTokenError:
          errorMessage = 'Invalid token';
          break;
        case err instanceof TokenExpiredError:
          errorMessage = 'Token expired';
          break;
        case err instanceof Error:
          errorMessage = err.message;
          break;
        default:
          errorMessage = 'Unauthorized';
      }

      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        status_code: HttpStatus.UNAUTHORIZED,
        status_text: 'Unauthorized',
        error: {
          name: 'AUTH_MIDDLEWARE_ERROR',
          message: errorMessage,
        },
      });
    }
  }
}
