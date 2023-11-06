import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guar';
import { CreateCustomerWithDefaultRoleDto } from 'src/customers/dto/create-customer.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Customer } from 'src/customers/entities/customer.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @ApiCreatedResponse({
    type: Customer,
  })
  @Post('register')
  async register(
    @Body() createCustomerDto: CreateCustomerWithDefaultRoleDto,
  ): Promise<Customer> {
    return await this.authService.register(createCustomerDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: Customer,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
