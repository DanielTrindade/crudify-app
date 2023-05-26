import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
//fazer a verificação do campo name por ser unique

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({ required: false })
  description: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ format: 'float', required: true })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  quantity: number;

  @IsNotEmpty()
  @ApiProperty({ default: new Date() })
  createdAt: Date;
  @IsNotEmpty()
  @ApiProperty({ required: true, nullable: true })
  userId: number;
}
