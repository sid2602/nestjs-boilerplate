import { CustomersService } from './../customers/customers.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { CreateCustomerWithDefaultRoleDto } from 'src/customers/dto/create-customer.dto';
import { Customer } from 'src/customers/entities/customer.entity';
import { LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async login(customer: Customer): Promise<LoginResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeCustomerData } = customer;
    const payload = safeCustomerData;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(
    createCustomerDto: CreateCustomerWithDefaultRoleDto,
  ): Promise<Customer | null> {
    return await this.customersService.create(createCustomerDto);
  }

  async getProfile(id: string): Promise<Customer> {
    const customer = await this.customersService.findOne(id);

    return customer;
  }

  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customersService.findOneQuery({ email });

    if (
      customer?.password !== undefined &&
      compareSync(password, customer.password)
    ) {
      return customer;
    }
    return null;
  }
}
