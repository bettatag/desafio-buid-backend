import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { CREATE_INSTANCE_USE_CASE_TOKEN } from 'src/shared/constants/di-constants';
import { ICreateInstanceUseCase } from '../../application/contracts/Services/create-instance-usecase.contract';
import { ERROR_MESSAGES } from '../../domain/constants/error-messages';
import { ICreateInstanceOutput } from '../../domain/contracts/output/create-instance-output.contract';
import { CreateEvolutionInstanceDto } from '../dtos/create-evolution-intance.dto';

@Controller('evolution')
export class EvolutionController {
  constructor(
    @Inject(CREATE_INSTANCE_USE_CASE_TOKEN)
    private readonly createInstanceUseCase: ICreateInstanceUseCase,
  ) {}

  @Post('create-instance')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEvolutionInstanceDto: CreateEvolutionInstanceDto,
  ): Promise<ICreateInstanceOutput> {
    try {
      const evolution = await this.createInstanceUseCase.create(createEvolutionInstanceDto);
      return evolution;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        ERROR_MESSAGES.INSTANCE_CREATION_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
