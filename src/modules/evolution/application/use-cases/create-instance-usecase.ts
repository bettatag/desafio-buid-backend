import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { ERROR_MESSAGES } from '../../../../shared/errors/error-messages';
import { ICreateInstanceInput } from '../../domain/contracts/input/create-instance-input.contract';
import { ICreateInstanceOutput } from '../../domain/contracts/output/create-instance-output.contract';
import { ICreateEvolutionInstanceRepository } from '../../domain/repositories/create-evolution-instance-repository.contract';
import { ICreateInstanceUseCase } from '../contracts/services/create-instance-usecase.contract';

@Injectable()
export class CreateEvolutionInstanceUseCase implements ICreateInstanceUseCase {
  constructor(
    @Inject(CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN)
    private readonly createEvolutionInstanceRepository: ICreateEvolutionInstanceRepository,
  ) {}

  async create(createInstanceInput: ICreateInstanceInput): Promise<ICreateInstanceOutput> {
    try {
      // Validações de negócio antes da criação
      this.validateBusinessRules(createInstanceInput);

      // Criar a instância
      const evolutionInstance =
        await this.createEvolutionInstanceRepository.create(createInstanceInput);

      // Validações de negócio após criação usando métodos da Entity
      if (!evolutionInstance.isActive()) {
        throw new HttpException(ERROR_MESSAGES.INSTANCE_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
      }

      if (!evolutionInstance.isValid()) {
        throw new HttpException(
          ERROR_MESSAGES.INVALID_INSTANCE_DATA,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!evolutionInstance.hasValidWebhook()) {
        throw new HttpException('Webhook configurado é inválido', HttpStatus.BAD_REQUEST);
      }

      return evolutionInstance;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        ERROR_MESSAGES.INSTANCE_PROCESSING_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateBusinessRules(input: ICreateInstanceInput): void {
    // Validação: Nome da instância não pode estar vazio após trim
    if (!input.instanceName?.trim()) {
      throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
    }

    // Validação: Token deve ter formato mínimo
    if (!input.token || input.token.length < 10) {
      throw new HttpException('Token deve ter pelo menos 10 caracteres', HttpStatus.BAD_REQUEST);
    }

    // Validação: Webhook deve ser uma URL válida
    if (!input.webhook || !this.isValidUrl(input.webhook)) {
      throw new HttpException('Webhook deve ser uma URL válida', HttpStatus.BAD_REQUEST);
    }

    // Validação: Número deve ter formato válido
    if (!input.number || input.number.length < 8) {
      throw new HttpException('Número deve ter pelo menos 8 dígitos', HttpStatus.BAD_REQUEST);
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
