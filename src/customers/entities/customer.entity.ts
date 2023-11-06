import { hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum CustomerRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity()
@Unique(['email'])
export class Customer {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ enum: CustomerRole, default: CustomerRole.VIEWER })
  @Column({
    type: 'enum',
    enum: CustomerRole,
    default: CustomerRole.VIEWER,
  })
  role: CustomerRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword?() {
    this.password = await hash(this.password, 10);
  }
}
