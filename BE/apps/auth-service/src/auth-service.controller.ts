import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';

type LoginBody = {
  email: string;
  password: string;
};

type CreateAccountBody = {
  employeeId?: number;
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

type UpdateAccountBody = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('login')
  login(@Body() body: LoginBody) {
    return this.authServiceService.login(body.email, body.password);
  }

  @Post('logout')
  logout(@Headers('authorization') authorization?: string) {
    return this.authServiceService.logout(this.extractBearerToken(authorization));
  }

  @Get('profile')
  profile(@Headers('authorization') authorization?: string) {
    return this.authServiceService.getProfile(this.extractBearerToken(authorization));
  }

  @Post('accounts')
  createAccount(
    @Body() body: CreateAccountBody,
    @Headers('x-internal-token') internalToken?: string,
  ) {
    return this.authServiceService.createAccount(body, internalToken);
  }

  @Put('accounts/:employeeId')
  updateAccount(
    @Param('employeeId') employeeId: string,
    @Body() body: UpdateAccountBody,
    @Headers('x-internal-token') internalToken?: string,
  ) {
    return this.authServiceService.updateAccount(employeeId, body, internalToken);
  }

  @Delete('accounts/:employeeId')
  deleteAccount(
    @Param('employeeId') employeeId: string,
    @Headers('x-internal-token') internalToken?: string,
  ) {
    return this.authServiceService.deleteAccount(employeeId, internalToken);
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization) {
      return '';
    }

    const [type, token] = authorization.split(' ');
    if (type?.toLowerCase() !== 'bearer') {
      return '';
    }

    return token ?? '';
  }
}
