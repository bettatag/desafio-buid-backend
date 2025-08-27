import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INSTANCE_MANAGEMENT_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IInstanceManagementRepository } from '../../domain/repositories/instance-management-repository.contract';
import { EvolutionInstanceEntity } from '../../domain/entities/evolution-instance.entity';
import {
  IInstanceManagementUseCase,
  IConnectInstanceInput,
  IConnectionStateInput,
  ILogoutInstanceInput,
  IDeleteInstanceInput,
  IRestartInstanceInput,
  IGetSettingsInput,
  IUpdateSettingsInput,
} from '../contracts/services/instance-management-usecase.contract';

@Injectable()
export class InstanceManagementUseCase implements IInstanceManagementUseCase {
  constructor(
    @Inject(INSTANCE_MANAGEMENT_REPOSITORY_TOKEN)
    private readonly instanceRepository: IInstanceManagementRepository,
  ) {}

  async connect(input: IConnectInstanceInput): Promise<{ status: string; qrcode?: string }> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.connect(input.instanceName);
  }

  async getConnectionState(input: IConnectionStateInput): Promise<{ state: string }> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.getConnectionState(input.instanceName);
  }

  async logout(input: ILogoutInstanceInput): Promise<{ message: string }> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.logout(input.instanceName);
  }

  async delete(input: IDeleteInstanceInput): Promise<{ message: string }> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.delete(input.instanceName);
  }

  async restart(input: IRestartInstanceInput): Promise<{ message: string }> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.restart(input.instanceName);
  }

  async getSettings(input: IGetSettingsInput): Promise<EvolutionInstanceEntity> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return instance;
  }

  async updateSettings(input: IUpdateSettingsInput): Promise<EvolutionInstanceEntity> {
    const instance = await this.instanceRepository.findByName(input.instanceName);
    if (!instance) {
      throw new NotFoundException(`Instance ${input.instanceName} not found`);
    }

    return await this.instanceRepository.updateSettings(input.instanceName, input.settings);
  }
}
