import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getworkingAPI(): object {
    return {
      status: 'a',
      message: 'API is running successfully',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}
