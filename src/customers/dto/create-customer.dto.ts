import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { CustomerRole } from '../entities/customer.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: CustomerRole, default: CustomerRole.VIEWER })
  @IsNotEmpty()
  role: CustomerRole;
}

export class CreateCustomerWithDefaultRoleDto extends OmitType(
  CreateCustomerDto,
  ['role'] as const,
) {}
