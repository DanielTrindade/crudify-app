import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class ProductEntity implements Product {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: 'number', format: 'float' })
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  userId: number;
}
