import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateCustomerDto,
  CreateCustomerWithDefaultRoleDto,
} from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto | CreateCustomerWithDefaultRoleDto,
  ): Promise<Customer | null> {
    try {
      const findUserWithThisSameEmail = await this.findOneQuery({
        email: createCustomerDto.email,
      });

      if (findUserWithThisSameEmail?.id !== undefined) {
        throw new HttpException(
          'Customer with this email already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const customerEntity =
        await this.customerRepository.create(createCustomerDto);
      const customer = await this.customerRepository.save(customerEntity);
      Logger.log('customers-service - create - created user');
      return customer;
    } catch (e) {
      Logger.error('customers-serive - create - error', e);
      return null;
    }
  }

  async findAll(): Promise<Customer[] | null> {
    try {
      return await this.customerRepository.find({});
    } catch (e) {
      Logger.error('customers-serive - findAll - error', e);
      return null;
    }
  }

  async findOne(id: string): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOneBy({ id });
    } catch (e) {
      Logger.error('customers-serive - findOne - error', e);
      return null;
    }
  }

  async findOneQuery(
    query: FindOptionsWhere<Customer>,
  ): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOneBy(query);
    } catch (e) {
      Logger.error('customers-serive - findOne - error', e);
      return null;
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer | null> {
    try {
      const customer = await this.findOne(id);
      const updateCustomerDtoWithID = await this.customerRepository.create({
        id,
        ...customer,
        ...updateCustomerDto,
      });

      const updatedCustomer = await this.customerRepository.save(
        updateCustomerDtoWithID,
      );

      Logger.log(`customers-service - update - updated user ${id}`);
      return updatedCustomer;
    } catch (e) {
      Logger.error('customers-serive - update - error', e);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const customer = await this.customerRepository.findOneBy({ id });

      if (!customer) {
        throw new Error(`No customer with id ${id}`);
      }

      await this.customerRepository.remove(customer);
      Logger.log(`customers-service - remove - removed user ${id}`);
      return;
    } catch (e) {
      Logger.error('customers-serive - remove - error', e);
    }
  }
}
