import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IsEmailAlreadyExistConstraint } from '../decorators/UsersDecorators/IsEmailAlreadyExist/is-email-already-exist.decorator';
@Module({
  controllers: [UsersController],
  providers: [UsersService, IsEmailAlreadyExistConstraint],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
