import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
}
