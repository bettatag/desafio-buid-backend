import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IConversationUseCase } from '../../application/contracts/services/conversation-usecase.contract';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CONVERSATION_USE_CASE_TOKEN } from '../../../../shared/constants/di-constants';
import { CreateConversationDto } from '../dtos/create-conversation.dto';
import { UpdateConversationDto } from '../dtos/update-conversation.dto';
import { SendMessageDto } from '../dtos/send-message.dto';
import { GetConversationsQueryDto, GetMessagesQueryDto } from '../dtos/query-params.dto';
import {
  ConversationResponseDto,
  ConversationListResponseDto,
  MessageListResponseDto,
  ChatCompletionResponseDto,
  ConversationStatsResponseDto,
} from '../outputs/conversation-response.dto';

@ApiTags('Conversations')
@ApiBearerAuth('JWT-auth')
@Controller('conversations')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);

  constructor(
    @Inject(CONVERSATION_USE_CASE_TOKEN)
    private readonly conversationUseCase: IConversationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova conversa',
    description: 'Cria uma nova conversa para o usuário autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversa criada com sucesso',
    type: ConversationResponseDto,
  })
  async createConversation(
    @CurrentUser() user: any,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    this.logger.log(`Creating conversation for user ${user.id}`);

    try {
      const conversation = await this.conversationUseCase.createConversation({
        userId: user.id,
        title: createConversationDto.title,
        context: createConversationDto.context,
      });

      this.logger.log(`Conversation created successfully: ${conversation.id}`);
      return conversation as ConversationResponseDto;
    } catch (error) {
      this.logger.error(
        `Error creating conversation for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar conversas do usuário',
    description: 'Retorna lista paginada de conversas do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conversas retornada com sucesso',
    type: ConversationListResponseDto,
  })
  async getConversations(
    @CurrentUser() user: any,
    @Query() query: GetConversationsQueryDto,
  ): Promise<ConversationListResponseDto> {
    this.logger.log(`Getting conversations for user ${user.id}`);

    try {
      const result = await this.conversationUseCase.getConversations({
        userId: user.id,
        page: query.page,
        limit: query.limit,
        isActive: query.isActive,
        search: query.search,
      });

      this.logger.log(`Retrieved ${result.conversations.length} conversations for user ${user.id}`);
      return result as ConversationListResponseDto;
    } catch (error) {
      this.logger.error(
        `Error getting conversations for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas das conversas',
    description: 'Retorna estatísticas das conversas do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    type: ConversationStatsResponseDto,
  })
  async getStats(@CurrentUser() user: any): Promise<ConversationStatsResponseDto> {
    this.logger.log(`Getting stats for user ${user.id}`);

    try {
      const stats = await this.conversationUseCase.getStats(user.id);
      this.logger.log(`Stats retrieved for user ${user.id}`);
      return stats as ConversationStatsResponseDto;
    } catch (error) {
      this.logger.error(
        `Error getting stats for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Get(':conversationId')
  @ApiOperation({
    summary: 'Obter conversa específica',
    description: 'Retorna detalhes de uma conversa específica',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversa retornada com sucesso',
    type: ConversationResponseDto,
  })
  async getConversation(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
  ): Promise<ConversationResponseDto> {
    this.logger.log(`Getting conversation ${conversationId} for user ${user.id}`);

    try {
      const conversation = await this.conversationUseCase.getConversation(conversationId, user.id);
      this.logger.log(`Conversation ${conversationId} retrieved for user ${user.id}`);
      return conversation as ConversationResponseDto;
    } catch (error) {
      this.logger.error(
        `Error getting conversation ${conversationId} for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Put(':conversationId')
  @ApiOperation({
    summary: 'Atualizar conversa',
    description: 'Atualiza dados de uma conversa específica',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversa atualizada com sucesso',
    type: ConversationResponseDto,
  })
  async updateConversation(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ): Promise<ConversationResponseDto> {
    this.logger.log(`Updating conversation ${conversationId} for user ${user.id}`);

    try {
      const conversation = await this.conversationUseCase.updateConversation({
        conversationId,
        userId: user.id,
        title: updateConversationDto.title,
        context: updateConversationDto.context,
        isActive: updateConversationDto.isActive,
      });

      this.logger.log(`Conversation ${conversationId} updated for user ${user.id}`);
      return conversation as ConversationResponseDto;
    } catch (error) {
      this.logger.error(
        `Error updating conversation ${conversationId} for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Delete(':conversationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir conversa',
    description: 'Exclui uma conversa específica (soft delete)',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  @ApiResponse({
    status: 204,
    description: 'Conversa excluída com sucesso',
  })
  async deleteConversation(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
  ): Promise<void> {
    this.logger.log(`Deleting conversation ${conversationId} for user ${user.id}`);

    try {
      await this.conversationUseCase.deleteConversation(conversationId, user.id);
      this.logger.log(`Conversation ${conversationId} deleted for user ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Error deleting conversation ${conversationId} for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Get(':conversationId/messages')
  @ApiOperation({
    summary: 'Obter mensagens da conversa',
    description: 'Retorna lista paginada de mensagens de uma conversa',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensagens retornadas com sucesso',
    type: MessageListResponseDto,
  })
  async getMessages(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageListResponseDto> {
    this.logger.log(`Getting messages for conversation ${conversationId}, user ${user.id}`);

    try {
      const result = await this.conversationUseCase.getMessages({
        conversationId,
        userId: user.id,
        page: query.page,
        limit: query.limit,
        role: query.role as any,
      });

      this.logger.log(`Retrieved ${result.messages.length} messages for conversation ${conversationId}`);
      return result as MessageListResponseDto;
    } catch (error) {
      this.logger.error(
        `Error getting messages for conversation ${conversationId}, user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  @Post(':conversationId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enviar mensagem',
    description: 'Envia mensagem para o OpenAI e retorna a resposta',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  @ApiResponse({
    status: 201,
    description: 'Mensagem enviada e resposta recebida com sucesso',
    type: ChatCompletionResponseDto,
  })
  async sendMessage(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ChatCompletionResponseDto> {
    this.logger.log(`Sending message to conversation ${conversationId} for user ${user.id}`);

    try {
      const result = await this.conversationUseCase.sendMessage({
        conversationId,
        userId: user.id,
        message: sendMessageDto.message,
        model: sendMessageDto.model,
        temperature: sendMessageDto.temperature,
        maxTokens: sendMessageDto.maxTokens,
      });

      this.logger.log(
        `Message sent successfully to conversation ${conversationId}, tokens used: ${result.tokensUsed}`,
      );
      return result as ChatCompletionResponseDto;
    } catch (error) {
      this.logger.error(
        `Error sending message to conversation ${conversationId} for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
