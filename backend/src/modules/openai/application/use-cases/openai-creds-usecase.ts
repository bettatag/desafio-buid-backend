import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { OPENAI_CREDS_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IOpenAICredsRepository } from '../../domain/repositories/openai-creds-repository.contract';
import { IOpenAICredsUseCase } from '../contracts/Services/openai-creds-usecase.contract';
import { ICreateOpenAICredsInput } from '../../domain/contracts/input/create-openai-creds-input.contract';
import {
  IOpenAICredsOutput,
  IOpenAICredsListOutput,
  IOpenAICredsDeleteOutput,
} from '../../domain/contracts/output/openai-creds-output.contract';

@Injectable()
export class OpenAICredsUseCase implements IOpenAICredsUseCase {
  constructor(
    @Inject(OPENAI_CREDS_REPOSITORY_TOKEN)
    private readonly openAICredsRepository: IOpenAICredsRepository,
  ) {}

  async create(instanceName: string, input: ICreateOpenAICredsInput): Promise<IOpenAICredsOutput> {
    // Validações de negócio
    this.validateCreateInput(input);
    this.validateInstanceName(instanceName);

    // Verificar se já existe credencial com o mesmo nome
    const existingCreds = await this.openAICredsRepository.findByName(instanceName, input.name);
    if (existingCreds) {
      throw new BadRequestException(`Credentials with name "${input.name}" already exist`);
    }

    const creds = await this.openAICredsRepository.create(instanceName, input);
    return creds;
  }

  async findAll(instanceName: string): Promise<IOpenAICredsListOutput> {
    this.validateInstanceName(instanceName);

    const creds = await this.openAICredsRepository.findAll(instanceName);
    return {
      creds,
      total: creds.length,
    };
  }

  async findById(instanceName: string, id: string): Promise<IOpenAICredsOutput | null> {
    this.validateInstanceName(instanceName);
    this.validateId(id);

    const creds = await this.openAICredsRepository.findById(instanceName, id);
    if (!creds) {
      throw new NotFoundException(`OpenAI credentials with ID ${id} not found`);
    }

    return creds;
  }

  async delete(instanceName: string, id: string): Promise<IOpenAICredsDeleteOutput> {
    this.validateInstanceName(instanceName);
    this.validateId(id);

    // Verificar se as credenciais existem
    const existingCreds = await this.openAICredsRepository.findById(instanceName, id);
    if (!existingCreds) {
      throw new NotFoundException(`OpenAI credentials with ID ${id} not found`);
    }

    await this.openAICredsRepository.delete(instanceName, id);

    return {
      message: `OpenAI credentials ${existingCreds.name} deleted successfully`,
      deletedId: id,
    };
  }

  private validateInstanceName(instanceName: string): void {
    if (!instanceName || instanceName.trim().length === 0) {
      throw new BadRequestException('Instance name is required');
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Credentials ID is required');
    }
  }

  private validateCreateInput(input: ICreateOpenAICredsInput): void {
    if (!input.name || input.name.trim().length === 0) {
      throw new BadRequestException('Credentials name is required');
    }

    if (!input.apiKey || input.apiKey.trim().length === 0) {
      throw new BadRequestException('API key is required');
    }

    // Validar formato básico da API key OpenAI
    if (!input.apiKey.startsWith('sk-')) {
      throw new BadRequestException('Invalid OpenAI API key format. Must start with "sk-"');
    }

    if (input.apiKey.length < 20) {
      throw new BadRequestException(
        'Invalid OpenAI API key length. Must be at least 20 characters',
      );
    }

    // Validar organização se fornecida
    if (input.organization && !input.organization.startsWith('org-')) {
      throw new BadRequestException('Invalid OpenAI organization format. Must start with "org-"');
    }
  }
}
