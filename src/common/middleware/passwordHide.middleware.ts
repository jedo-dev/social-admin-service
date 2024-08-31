import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PasswordHideMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(res);

    next();
  }
}
