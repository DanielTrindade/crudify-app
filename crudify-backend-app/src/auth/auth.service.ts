import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async login(email: string, password: string): Promise<AuthEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        accessToken: this.jwtService.sign({ userId: user.id }),
        userId: user.id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Tratar a exceção de usuário não encontrado
        return {
          accessToken: '',
          userId: 0,
        };
      } else if (error instanceof UnauthorizedException) {
        return {
          accessToken: '',
          userId: 0,
        };
      } else {
        // Tratar outros erros
        return {
          accessToken: '',
          userId: 0,
        };
      }
    }
  }
}
