import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';

import { IsEmailUnique } from 'src/decorators/IsEmailUnique.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique({ message: 'E-mail já cadastrado' })
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ default: new Date() })
  createdAt: Date;

  @ApiProperty({ nullable: true, required: false })
  updatedAt: Date;
}
