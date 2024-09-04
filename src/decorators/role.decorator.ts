import { SetMetadata } from '@nestjs/common';
export const ROLE_KEY = 'Roles';
export const Role = (role: string) => SetMetadata(ROLE_KEY, role);
