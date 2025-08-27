import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PRISMA_CLIENT_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { ERROR_MESSAGES } from '../../../../shared/errors/error-messages';
import { ICreateInstanceInput } from '../../domain/contracts/input/create-instance-input.contract';
import { ICreateInstanceOutput } from '../../domain/contracts/output/create-instance-output.contract';
import { EvolutionInstanceEntity } from '../../domain/entities/evolution-instance.entity';
import { ICreateEvolutionInstanceRepository } from '../../domain/repositories/create-evolution-instance-repository.contract';

@Injectable()
export class CreateEvolutionInstanceRepository implements ICreateEvolutionInstanceRepository {
  constructor(
    @Inject(PRISMA_CLIENT_TOKEN)
    private readonly prismaClient: IDbService,
  ) {}

  async create(createInstanceInput: ICreateInstanceInput): Promise<ICreateInstanceOutput> {
    try {
      const evolutionInstance = await this.prismaClient.evolutionInstance.create({
        data: {
          instance: {
            create: {
              instanceName: createInstanceInput.instanceName,
              instanceId: createInstanceInput.number,
              webhookWaBusiness: createInstanceInput.webhook,
              accessTokenWaBusiness: createInstanceInput.token,
              status: 'ACTIVE',
            },
          },
          hash: {
            create: {
              apikey: createInstanceInput.token,
            },
          },
          settings: {
            create: {
              rejectCall: createInstanceInput.reject_call,
              msgCall: createInstanceInput.msg_call,
              groupsIgnore: createInstanceInput.groups_ignore,
              alwaysOnline: createInstanceInput.always_online,
              readMessages: createInstanceInput.read_messages,
              readStatus: createInstanceInput.read_status,
              syncFullHistory: true,
            },
          },
        },
        include: {
          instance: true,
          hash: true,
          settings: true,
        },
      });

      // Validar se os dados foram criados corretamente
      if (!evolutionInstance.instance || !evolutionInstance.hash || !evolutionInstance.settings) {
        throw new HttpException(
          ERROR_MESSAGES.INVALID_INSTANCE_DATA,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Criar e retornar a Entity rica
      return EvolutionInstanceEntity.create({
        instance: {
          instanceName: evolutionInstance.instance.instanceName,
          instanceId: evolutionInstance.instance.instanceId,
          webhook_wa_business: evolutionInstance.instance.webhookWaBusiness || null,
          access_token_wa_business: evolutionInstance.instance.accessTokenWaBusiness,
          status: evolutionInstance.instance.status,
        },
        hash: {
          apikey: evolutionInstance.hash.apikey,
        },
        settings: {
          reject_call: evolutionInstance.settings.rejectCall,
          msg_call: evolutionInstance.settings.msgCall,
          groups_ignore: evolutionInstance.settings.groupsIgnore,
          always_online: evolutionInstance.settings.alwaysOnline,
          read_messages: evolutionInstance.settings.readMessages,
          read_status: evolutionInstance.settings.readStatus,
          sync_full_history: evolutionInstance.settings.syncFullHistory,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(ERROR_MESSAGES.DATABASE_SAVE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
