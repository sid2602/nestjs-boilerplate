import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerRole } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guar';
import { Roles } from 'src/auth/roles.decorator';
import { RolesAuthGuard } from 'src/auth/roles-auth.guard';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: `${CustomerRole.ADMIN}`,
    type: Customer,
  })
  @Roles(CustomerRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer | null> {
    return await this.customersService.create(createCustomerDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: `${CustomerRole.ADMIN} ${CustomerRole.EDITOR}`,
    type: Customer,
    isArray: true,
  })
  @Roles(CustomerRole.ADMIN, CustomerRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Get()
  async findAll(): Promise<Customer[] | null> {
    return await this.customersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: `${CustomerRole.ADMIN} ${CustomerRole.EDITOR}`,
    type: Customer,
  })
  @Roles(CustomerRole.ADMIN, CustomerRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer | null> {
    return await this.customersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: `${CustomerRole.ADMIN}`,
    type: Customer,
  })
  @Roles(CustomerRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer | undefined> {
    return await this.customersService.update(id, updateCustomerDto);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: `${CustomerRole.ADMIN}`,
    type: Customer,
  })
  @Roles(CustomerRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.customersService.remove(id);
  }
}
