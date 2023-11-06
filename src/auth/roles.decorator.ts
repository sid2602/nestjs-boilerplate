import { SetMetadata } from '@nestjs/common';
import { CustomerRole } from 'src/customers/entities/customer.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: CustomerRole[]) =>
  SetMetadata(ROLES_KEY, roles);
