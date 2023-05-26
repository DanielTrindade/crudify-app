import { Module } from '@nestjs/common';
import { IsEmailUnique } from 'src/decorators/IsEmailUnique.decorator';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [UsersService],
  imports: [UsersModule],
  exports: [UsersService],
})
export class IsEmailUniqueModule {}
