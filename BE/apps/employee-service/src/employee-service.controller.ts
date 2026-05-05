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
import { EmployeeServiceService } from './employee-service.service';

type CreateEmployeeBody = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

type UpdateEmployeeBody = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

@Controller('employees')
export class EmployeeServiceController {
  constructor(private readonly employeeServiceService: EmployeeServiceService) {}

  @Get()
  findAll(@Headers('authorization') authorization?: string) {
    return this.employeeServiceService.findAll(this.extractBearerToken(authorization));
  }

  @Post()
  create(
    @Body() payload: CreateEmployeeBody,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeServiceService.create(
      payload,
      this.extractBearerToken(authorization),
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeeBody,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeServiceService.update(
      id,
      payload,
      this.extractBearerToken(authorization),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    return this.employeeServiceService.remove(id, this.extractBearerToken(authorization));
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
