import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CREATE_INSTANCE_USE_CASE_TOKEN,
  FETCH_INSTANCES_USE_CASE_TOKEN,
  INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
  MESSAGE_USE_CASE_TOKEN,
  SESSION_USE_CASE_TOKEN,
} from 'src/shared/constants/di-constants';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ERROR_MESSAGES } from 'src/shared/errors/error-messages';
import { ICreateInstanceUseCase } from '../../application/contracts/Services/create-instance-usecase.contract';
import { IFetchInstancesUseCase } from '../../application/contracts/Services/fetch-instances-usecase.contract';
import { IInstanceManagementUseCase } from '../../application/contracts/Services/instance-management-usecase.contract';
import { IMessageUseCase } from '../../application/contracts/Services/message-usecase.contract';
import { ISessionUseCase } from '../../application/contracts/Services/session-usecase.contract';
import { ICreateInstanceOutput } from '../../domain/contracts/output/create-instance-output.contract';
import { EvolutionInstanceEntity } from '../../domain/entities/evolution-instance.entity';
import { CreateEvolutionInstanceDto } from '../dtos/create-evolution-intance.dto';
import { FetchInstancesDto } from '../dtos/fetch-instances.dto';
import { UpdateSettingsDto } from '../dtos/update-settings.dto';
import { SendTextMessageDto } from '../dtos/send-text-message.dto';
import { SendMediaMessageDto } from '../dtos/send-media-message.dto';
import { WebhookEventDto } from '../dtos/webhook-event.dto';
import { ChangeSessionStatusDto, CreateSessionDto, GetSessionsQueryDto } from '../dtos/session-management.dto';
import { SendMessageResponseDto, MessageHistoryResponseDto, WebhookProcessResponseDto } from '../outputs/message-response.contract';
import { SessionEntity } from '../../domain/entities/session.entity';

@ApiTags('Evolution')
@Controller('evolution')
export class EvolutionController {
  constructor(
    @Inject(CREATE_INSTANCE_USE_CASE_TOKEN)
    private readonly createInstanceUseCase: ICreateInstanceUseCase,
    @Inject(FETCH_INSTANCES_USE_CASE_TOKEN)
    private readonly fetchInstancesUseCase: IFetchInstancesUseCase,
    @Inject(INSTANCE_MANAGEMENT_USE_CASE_TOKEN)
    private readonly instanceManagementUseCase: IInstanceManagementUseCase,
    @Inject(MESSAGE_USE_CASE_TOKEN)
    private readonly messageUseCase: IMessageUseCase,
    @Inject(SESSION_USE_CASE_TOKEN)
    private readonly sessionUseCase: ISessionUseCase,
  ) {}

  @Post('create-instance')
  @HttpCode(HttpStatus.CREATED)
  @IsPublic()
  @ApiOperation({
    summary: 'Criar nova instância do Evolution',
    description: 'Cria uma nova instância do Evolution API com as configurações especificadas',
  })
  @ApiBody({
    type: CreateEvolutionInstanceDto,
    description: 'Dados para criação da instância',
    examples: {
      example1: {
        summary: 'Exemplo básico',
        description: 'Exemplo de payload para criar uma instância',
        value: {
          instanceName: 'minha-instancia',
          token: 'seu-token-aqui-com-pelo-menos-10-caracteres',
          qrcode: true,
          number: '5511999999999',
          integration: 'WHATSAPP-BAILEYS',
          webhook: 'https://seu-webhook.com/callback',
          webhook_by_events: true,
          events: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE'],
          reject_call: false,
          msg_call: 'Chamadas não são aceitas',
          groups_ignore: false,
          always_online: true,
          read_messages: true,
          read_status: true,
          websocket_enabled: false,
          websocket_events: [],
          proxy: {
            host: '127.0.0.1',
            port: '8080',
            protocol: 'http',
            username: 'user',
            password: 'pass',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Instância criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        instance: {
          type: 'object',
          properties: {
            instanceName: { type: 'string', example: 'minha-instancia' },
            instanceId: { type: 'string', example: 'uuid-da-instancia' },
            webhook_wa_business: {
              type: 'string',
              nullable: true,
              example: 'https://seu-webhook.com/callback',
            },
            access_token_wa_business: { type: 'string', example: 'token-de-acesso' },
            status: { type: 'string', example: 'ACTIVE' },
          },
        },
        hash: {
          type: 'object',
          properties: {
            apikey: { type: 'string', example: 'chave-api-gerada' },
          },
        },
        settings: {
          type: 'object',
          properties: {
            reject_call: { type: 'boolean', example: false },
            msg_call: { type: 'string', example: 'Chamadas não são aceitas' },
            groups_ignore: { type: 'boolean', example: false },
            always_online: { type: 'boolean', example: true },
            read_messages: { type: 'boolean', example: true },
            read_status: { type: 'boolean', example: true },
            sync_full_history: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'instanceName must be between 3 and 50 characters',
            'token must be between 10 and 500 characters',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Erro interno ao criar instância' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
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

  @Get('fetchInstances')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar todas as instâncias',
    description: 'Retorna uma lista de todas as instâncias do Evolution API com filtros opcionais',
  })
  @ApiQuery({
    name: 'instanceName',
    required: false,
    description: 'Filtrar por nome da instância',
    example: 'minha-instancia',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'INACTIVE', 'CONNECTING', 'DISCONNECTED'],
    description: 'Filtrar por status da instância',
  })
  @ApiOkResponse({
    description: 'Lista de instâncias retornada com sucesso',
    type: [EvolutionInstanceEntity],
  })
  async fetchInstances(@Query() query: FetchInstancesDto): Promise<EvolutionInstanceEntity[]> {
    try {
      return await this.fetchInstancesUseCase.execute(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar instâncias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('connect/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Conectar instância',
    description: 'Inicia a conexão de uma instância específica do WhatsApp',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância a ser conectada',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Conexão iniciada com sucesso',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'connecting' },
        qrcode: { type: 'string', example: 'data:image/png;base64,...' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async connect(
    @Param('instanceName') instanceName: string,
  ): Promise<{ status: string; qrcode?: string }> {
    try {
      return await this.instanceManagementUseCase.connect({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao conectar instância',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('connectionState/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Estado da conexão',
    description: 'Verifica o estado atual da conexão de uma instância',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Estado da conexão retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        state: { type: 'string', example: 'open' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async getConnectionState(
    @Param('instanceName') instanceName: string,
  ): Promise<{ state: string }> {
    try {
      return await this.instanceManagementUseCase.getConnectionState({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao verificar estado da conexão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('logout/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Logout da instância',
    description: 'Desconecta uma instância do WhatsApp sem deletá-la',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Instance minha-instancia logged out successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async logout(@Param('instanceName') instanceName: string): Promise<{ message: string }> {
    try {
      return await this.instanceManagementUseCase.logout({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao fazer logout da instância',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Deletar instância',
    description: 'Remove completamente uma instância do sistema',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Instância deletada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Instance minha-instancia deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async delete(@Param('instanceName') instanceName: string): Promise<{ message: string }> {
    try {
      return await this.instanceManagementUseCase.delete({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao deletar instância',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('restart/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Reiniciar instância',
    description: 'Reinicia uma instância específica do WhatsApp',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Instância reiniciada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Instance minha-instancia restarted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async restart(@Param('instanceName') instanceName: string): Promise<{ message: string }> {
    try {
      return await this.instanceManagementUseCase.restart({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao reiniciar instância',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('settings/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar configurações da instância',
    description: 'Retorna as configurações atuais de uma instância específica',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Configurações retornadas com sucesso',
    type: EvolutionInstanceEntity,
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  async getSettings(@Param('instanceName') instanceName: string): Promise<EvolutionInstanceEntity> {
    try {
      return await this.instanceManagementUseCase.getSettings({ instanceName });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar configurações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('settings/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Atualizar configurações da instância',
    description: 'Atualiza as configurações de uma instância específica',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: UpdateSettingsDto,
    description: 'Novas configurações da instância',
    examples: {
      example1: {
        summary: 'Exemplo de atualização',
        value: {
          webhook: 'https://novo-webhook.com/callback',
          webhook_by_events: true,
          events: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE'],
          reject_call: true,
          msg_call: 'Chamadas não são aceitas',
          always_online: false,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Configurações atualizadas com sucesso',
    type: EvolutionInstanceEntity,
  })
  @ApiNotFoundResponse({
    description: 'Instância não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
  })
  async updateSettings(
    @Param('instanceName') instanceName: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<EvolutionInstanceEntity> {
    try {
      return await this.instanceManagementUseCase.updateSettings({
        instanceName,
        settings: updateSettingsDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao atualizar configurações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===== ENDPOINTS DE MENSAGENS =====

  @Post('message/text/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Enviar mensagem de texto',
    description: 'Envia uma mensagem de texto para um contato específico via WhatsApp',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: SendTextMessageDto,
    description: 'Dados da mensagem de texto',
  })
  @ApiOkResponse({
    description: 'Mensagem enviada com sucesso',
    type: SendMessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  async sendTextMessage(
    @Param('instanceName') instanceName: string,
    @Body() sendTextMessageDto: SendTextMessageDto,
  ): Promise<SendMessageResponseDto> {
    try {
      const result = await this.messageUseCase.sendTextMessage({
        instanceName,
        ...sendTextMessageDto,
      });

      return {
        ...result,
        message: 'Mensagem de texto enviada com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao enviar mensagem de texto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('message/media/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Enviar mensagem de mídia',
    description: 'Envia uma mensagem de mídia (imagem, vídeo, áudio ou documento) para um contato específico',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: SendMediaMessageDto,
    description: 'Dados da mensagem de mídia',
  })
  @ApiOkResponse({
    description: 'Mensagem de mídia enviada com sucesso',
    type: SendMessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  async sendMediaMessage(
    @Param('instanceName') instanceName: string,
    @Body() sendMediaMessageDto: SendMediaMessageDto,
  ): Promise<SendMessageResponseDto> {
    try {
      const result = await this.messageUseCase.sendMediaMessage({
        instanceName,
        ...sendMediaMessageDto,
      });

      return {
        ...result,
        message: 'Mensagem de mídia enviada com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao enviar mensagem de mídia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('message/history/:instanceName/:contactNumber')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar histórico de mensagens',
    description: 'Recupera o histórico de mensagens entre a instância e um contato específico',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'contactNumber',
    description: 'Número do contato',
    example: '5511999999999',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de mensagens a retornar',
    example: 50,
    required: false,
  })
  @ApiOkResponse({
    description: 'Histórico de mensagens recuperado com sucesso',
    type: MessageHistoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Instância ou contato não encontrado',
  })
  async getMessageHistory(
    @Param('instanceName') instanceName: string,
    @Param('contactNumber') contactNumber: string,
    @Query('limit') limit?: number,
  ): Promise<MessageHistoryResponseDto> {
    try {
      const messages = await this.messageUseCase.getMessageHistory(
        instanceName,
        contactNumber,
        limit,
      );

      return {
        messages: messages.map(msg => ({
          id: msg.id,
          timestamp: msg.timestamp,
          from: msg.from,
          to: msg.to,
          content: msg.content,
          type: msg.type,
          status: msg.status,
          fromMe: msg.fromMe,
          instanceName: msg.instanceName,
        })),
        total: messages.length,
        instanceName,
        contactNumber,
        message: 'Histórico de mensagens recuperado com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar histórico de mensagens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('message/mark-read/:instanceName/:messageId')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Marcar mensagem como lida',
    description: 'Marca uma mensagem específica como lida',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'messageId',
    description: 'ID da mensagem',
    example: 'msg-123456789',
  })
  @ApiOkResponse({
    description: 'Mensagem marcada como lida com sucesso',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Mensagem marcada como lida com sucesso' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Mensagem não encontrada',
  })
  async markMessageAsRead(
    @Param('instanceName') instanceName: string,
    @Param('messageId') messageId: string,
  ): Promise<{ status: string; message: string }> {
    try {
      await this.messageUseCase.markAsRead(instanceName, messageId);

      return {
        status: 'success',
        message: 'Mensagem marcada como lida com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao marcar mensagem como lida',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===== ENDPOINT DE WEBHOOK =====

  @Post('webhook/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Processar evento webhook',
    description: 'Recebe e processa eventos de webhook do WhatsApp',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: WebhookEventDto,
    description: 'Dados do evento webhook',
  })
  @ApiOkResponse({
    description: 'Evento webhook processado com sucesso',
    type: WebhookProcessResponseDto,
  })
  async processWebhook(
    @Param('instanceName') instanceName: string,
    @Body() webhookEventDto: WebhookEventDto,
  ): Promise<WebhookProcessResponseDto> {
    try {
      await this.messageUseCase.processWebhookEvent({
        ...webhookEventDto,
        instance: {
          ...webhookEventDto.instance,
          instanceName,
        },
      });

      return {
        status: 'processed',
        eventType: webhookEventDto.event,
        processedAt: Date.now(),
        message: 'Evento webhook processado com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao processar evento webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ===== ENDPOINTS DE GERENCIAMENTO DE SESSÕES =====

  @Post('session/:instanceName')
  @HttpCode(HttpStatus.CREATED)
  @IsPublic()
  @ApiOperation({
    summary: 'Criar nova sessão de conversa',
    description: 'Cria uma nova sessão de conversa para um contato específico',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: CreateSessionDto,
    description: 'Dados da nova sessão',
  })
  @ApiCreatedResponse({
    description: 'Sessão criada com sucesso',
    type: SessionEntity,
  })
  async createSession(
    @Param('instanceName') instanceName: string,
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<SessionEntity> {
    try {
      const result = await this.sessionUseCase.createSession({
        instanceName,
        ...createSessionDto,
      });

      return new SessionEntity(
        result.id,
        result.instanceName,
        result.remoteJid,
        result.status,
        result.context,
        result.createdAt,
        result.updatedAt,
        result.messageCount,
        result.lastMessageAt,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao criar sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('session/status/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Alterar status da sessão',
    description: 'Altera o status de uma sessão específica (opened, paused, closed)',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: ChangeSessionStatusDto,
    description: 'Dados para alteração do status',
  })
  @ApiOkResponse({
    description: 'Status da sessão alterado com sucesso',
    type: SessionEntity,
  })
  async changeSessionStatus(
    @Param('instanceName') instanceName: string,
    @Body() changeStatusDto: ChangeSessionStatusDto,
  ): Promise<SessionEntity> {
    try {
      const result = await this.sessionUseCase.changeSessionStatus({
        instanceName,
        ...changeStatusDto,
      });

      return new SessionEntity(
        result.id,
        result.instanceName,
        result.remoteJid,
        result.status,
        result.context,
        result.createdAt,
        result.updatedAt,
        result.messageCount,
        result.lastMessageAt,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao alterar status da sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sessions/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Listar sessões da instância',
    description: 'Recupera todas as sessões de uma instância com filtros opcionais',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filtrar por status das sessões',
    enum: ['opened', 'paused', 'closed', 'all'],
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de sessões a retornar',
    example: 50,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Deslocamento para paginação',
    example: 0,
    required: false,
  })
  @ApiOkResponse({
    description: 'Lista de sessões recuperada com sucesso',
    schema: {
      type: 'object',
      properties: {
        sessions: {
          type: 'array',
          items: { $ref: '#/components/schemas/SessionEntity' },
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 50 },
      },
    },
  })
  async getSessions(
    @Param('instanceName') instanceName: string,
    @Query() query: GetSessionsQueryDto,
  ) {
    try {
      const result = await this.sessionUseCase.getSessions({
        instanceName,
        ...query,
      });

      return {
        sessions: result.sessions.map(session => new SessionEntity(
          session.id,
          session.instanceName,
          session.remoteJid,
          session.status,
          session.context,
          session.createdAt,
          session.updatedAt,
          session.messageCount,
          session.lastMessageAt,
        )),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao listar sessões',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/:instanceName/:contactNumber')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar sessão específica',
    description: 'Recupera uma sessão específica por instância e contato',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'contactNumber',
    description: 'Número do contato',
    example: '5511999999999',
  })
  @ApiOkResponse({
    description: 'Sessão encontrada',
    type: SessionEntity,
  })
  @ApiNotFoundResponse({
    description: 'Sessão não encontrada',
  })
  async getSession(
    @Param('instanceName') instanceName: string,
    @Param('contactNumber') contactNumber: string,
  ): Promise<SessionEntity> {
    try {
      const result = await this.sessionUseCase.getSession(instanceName, contactNumber);

      if (!result) {
        throw new HttpException('Sessão não encontrada', HttpStatus.NOT_FOUND);
      }

      return new SessionEntity(
        result.id,
        result.instanceName,
        result.remoteJid,
        result.status,
        result.context,
        result.createdAt,
        result.updatedAt,
        result.messageCount,
        result.lastMessageAt,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('session/:instanceName/:contactNumber')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Excluir sessão',
    description: 'Exclui uma sessão específica',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'contactNumber',
    description: 'Número do contato',
    example: '5511999999999',
  })
  @ApiOkResponse({
    description: 'Sessão excluída com sucesso',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Sessão excluída com sucesso' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Sessão não encontrada',
  })
  async deleteSession(
    @Param('instanceName') instanceName: string,
    @Param('contactNumber') contactNumber: string,
  ): Promise<{ status: string; message: string }> {
    try {
      await this.sessionUseCase.deleteSession(instanceName, contactNumber);

      return {
        status: 'success',
        message: 'Sessão excluída com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao excluir sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sessions/stats/:instanceName')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Estatísticas das sessões',
    description: 'Recupera estatísticas das sessões de uma instância',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiOkResponse({
    description: 'Estatísticas recuperadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 25 },
        opened: { type: 'number', example: 10 },
        paused: { type: 'number', example: 8 },
        closed: { type: 'number', example: 7 },
        totalMessages: { type: 'number', example: 150 },
      },
    },
  })
  async getSessionStats(
    @Param('instanceName') instanceName: string,
  ) {
    try {
      return await this.sessionUseCase.getSessionStats(instanceName);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao obter estatísticas das sessões',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
