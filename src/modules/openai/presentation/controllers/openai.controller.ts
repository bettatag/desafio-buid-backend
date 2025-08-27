import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  OPENAI_BOT_USE_CASE_TOKEN,
  OPENAI_CREDS_USE_CASE_TOKEN,
  OPENAI_SETTINGS_USE_CASE_TOKEN,
} from '../../../../shared/constants/di-constants';
import { IOpenAIBotUseCase } from '../../application/contracts/Services/openai-bot-usecase.contract';
import { IOpenAICredsUseCase } from '../../application/contracts/Services/openai-creds-usecase.contract';
import { IOpenAISettingsUseCase } from '../../application/contracts/Services/openai-settings-usecase.contract';
import { IsPublic } from '../decorators/is-public.decorator';
import { ChangeStatusDto } from '../dtos/change-status.dto';
import { CreateOpenAIBotDto } from '../dtos/create-openai-bot.dto';
import { CreateOpenAICredsDto } from '../dtos/create-openai-creds.dto';
import { CreateOpenAISettingsDto } from '../dtos/create-openai-settings.dto';
import { UpdateOpenAIBotDto } from '../dtos/update-openai-bot.dto';
import {
  OpenAIBotResponseDto,
  OpenAIBotListResponseDto,
  OpenAIBotDeleteResponseDto,
  OpenAIBotStatusResponseDto,
} from '../outputs/openai-bot-response.contract';
import {
  OpenAICredsResponseDto,
  OpenAICredsListResponseDto,
  OpenAICredsDeleteResponseDto,
} from '../outputs/openai-creds-response.contract';
import {
  OpenAISettingsResponseDto,
  OpenAISettingsDeleteResponseDto,
} from '../outputs/openai-settings-response.contract';

@ApiTags('OpenAI')
@Controller('openai')
@ApiBearerAuth()
export class OpenAIController {
  constructor(
    @Inject(OPENAI_BOT_USE_CASE_TOKEN)
    private readonly openAIBotUseCase: IOpenAIBotUseCase,
    @Inject(OPENAI_CREDS_USE_CASE_TOKEN)
    private readonly openAICredsUseCase: IOpenAICredsUseCase,
    @Inject(OPENAI_SETTINGS_USE_CASE_TOKEN)
    private readonly openAISettingsUseCase: IOpenAISettingsUseCase,
  ) {}

  @Post('create/:instanceName')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar bot OpenAI',
    description: 'Cria um novo bot OpenAI para a instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: CreateOpenAIBotDto,
    description: 'Dados para criação do bot OpenAI',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bot OpenAI criado com sucesso',
    type: OpenAIBotResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async createBot(
    @Param('instanceName') instanceName: string,
    @Body() createBotDto: CreateOpenAIBotDto,
  ): Promise<OpenAIBotResponseDto> {
    const bot = await this.openAIBotUseCase.create(instanceName, createBotDto);

    return {
      bot,
      message: 'Bot OpenAI criado com sucesso',
    };
  }

  @Get('find/:instanceName')
  @IsPublic()
  @ApiOperation({
    summary: 'Listar bots OpenAI',
    description: 'Lista todos os bots OpenAI da instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bots OpenAI encontrados com sucesso',
    type: OpenAIBotListResponseDto,
  })
  async findBots(@Param('instanceName') instanceName: string): Promise<OpenAIBotListResponseDto> {
    const result = await this.openAIBotUseCase.findAll(instanceName);

    return {
      bots: result.bots,
      total: result.total,
      message: 'Bots OpenAI encontrados com sucesso',
    };
  }

  @Get('find/:instanceName/:id')
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar bot OpenAI por ID',
    description: 'Busca um bot OpenAI específico pelo ID',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do bot OpenAI',
    example: 'bot-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bot OpenAI encontrado com sucesso',
    type: OpenAIBotResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bot OpenAI não encontrado',
  })
  async findBotById(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
  ): Promise<OpenAIBotResponseDto> {
    const bot = await this.openAIBotUseCase.findById(instanceName, id);

    return {
      bot: bot!,
      message: 'Bot OpenAI encontrado com sucesso',
    };
  }

  @Put('update/:instanceName/:id')
  @IsPublic()
  @ApiOperation({
    summary: 'Atualizar bot OpenAI',
    description: 'Atualiza um bot OpenAI existente',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do bot OpenAI',
    example: 'bot-123',
  })
  @ApiBody({
    type: UpdateOpenAIBotDto,
    description: 'Dados para atualização do bot OpenAI',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bot OpenAI atualizado com sucesso',
    type: OpenAIBotResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bot OpenAI não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async updateBot(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
    @Body() updateBotDto: UpdateOpenAIBotDto,
  ): Promise<OpenAIBotResponseDto> {
    const bot = await this.openAIBotUseCase.update(instanceName, { id, ...updateBotDto });

    return {
      bot,
      message: 'Bot OpenAI atualizado com sucesso',
    };
  }

  @Delete('delete/:instanceName/:id')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletar bot OpenAI',
    description: 'Remove um bot OpenAI da instância',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do bot OpenAI',
    example: 'bot-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bot OpenAI deletado com sucesso',
    type: OpenAIBotDeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bot OpenAI não encontrado',
  })
  async deleteBot(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
  ): Promise<OpenAIBotDeleteResponseDto> {
    const result = await this.openAIBotUseCase.delete(instanceName, id);

    return result;
  }

  @Post('changeStatus/:instanceName/:id')
  @IsPublic()
  @ApiOperation({
    summary: 'Alterar status do bot OpenAI',
    description: 'Ativa ou desativa um bot OpenAI',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do bot OpenAI',
    example: 'bot-123',
  })
  @ApiBody({
    type: ChangeStatusDto,
    description: 'Novo status do bot',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status do bot OpenAI alterado com sucesso',
    type: OpenAIBotStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bot OpenAI não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async changeStatus(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ): Promise<OpenAIBotStatusResponseDto> {
    const result = await this.openAIBotUseCase.changeStatus(instanceName, {
      id,
      enabled: changeStatusDto.enabled,
    });

    return result;
  }

  // ===== CREDENCIAIS OPENAI ENDPOINTS =====

  @Post('creds/:instanceName')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar credenciais OpenAI',
    description: 'Configura as credenciais OpenAI para a instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: CreateOpenAICredsDto,
    description: 'Dados das credenciais OpenAI',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credenciais OpenAI criadas com sucesso',
    type: OpenAICredsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async createCreds(
    @Param('instanceName') instanceName: string,
    @Body() createCredsDto: CreateOpenAICredsDto,
  ): Promise<OpenAICredsResponseDto> {
    const creds = await this.openAICredsUseCase.create(instanceName, createCredsDto);

    return {
      creds,
      message: 'Credenciais OpenAI criadas com sucesso',
    };
  }

  @Get('creds/:instanceName')
  @IsPublic()
  @ApiOperation({
    summary: 'Listar credenciais OpenAI',
    description: 'Lista todas as credenciais OpenAI da instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credenciais OpenAI encontradas com sucesso',
    type: OpenAICredsListResponseDto,
  })
  async findCreds(
    @Param('instanceName') instanceName: string,
  ): Promise<OpenAICredsListResponseDto> {
    const result = await this.openAICredsUseCase.findAll(instanceName);

    return {
      creds: result.creds,
      total: result.total,
      message: 'Credenciais OpenAI encontradas com sucesso',
    };
  }

  @Get('creds/:instanceName/:id')
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar credenciais OpenAI por ID',
    description: 'Busca credenciais OpenAI específicas pelo ID',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID das credenciais OpenAI',
    example: 'creds-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credenciais OpenAI encontradas com sucesso',
    type: OpenAICredsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credenciais OpenAI não encontradas',
  })
  async findCredsById(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
  ): Promise<OpenAICredsResponseDto> {
    const creds = await this.openAICredsUseCase.findById(instanceName, id);

    return {
      creds: creds!,
      message: 'Credenciais OpenAI encontradas com sucesso',
    };
  }

  @Delete('creds/:instanceName/:id')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletar credenciais OpenAI',
    description: 'Remove as credenciais OpenAI da instância',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiParam({
    name: 'id',
    description: 'ID das credenciais OpenAI',
    example: 'creds-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credenciais OpenAI deletadas com sucesso',
    type: OpenAICredsDeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credenciais OpenAI não encontradas',
  })
  async deleteCreds(
    @Param('instanceName') instanceName: string,
    @Param('id') id: string,
  ): Promise<OpenAICredsDeleteResponseDto> {
    const result = await this.openAICredsUseCase.delete(instanceName, id);

    return result;
  }

  // ===== CONFIGURAÇÕES OPENAI ENDPOINTS =====

  @Post('settings/:instanceName')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar configurações OpenAI',
    description: 'Configura os parâmetros OpenAI para a instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: CreateOpenAISettingsDto,
    description: 'Dados das configurações OpenAI',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Configurações OpenAI criadas com sucesso',
    type: OpenAISettingsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async createSettings(
    @Param('instanceName') instanceName: string,
    @Body() createSettingsDto: CreateOpenAISettingsDto,
  ): Promise<OpenAISettingsResponseDto> {
    const settings = await this.openAISettingsUseCase.create(instanceName, createSettingsDto);

    return {
      settings,
      message: 'Configurações OpenAI criadas com sucesso',
    };
  }

  @Get('settings/:instanceName')
  @IsPublic()
  @ApiOperation({
    summary: 'Buscar configurações OpenAI',
    description: 'Busca as configurações OpenAI da instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configurações OpenAI encontradas com sucesso',
    type: OpenAISettingsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configurações OpenAI não encontradas',
  })
  async findSettings(
    @Param('instanceName') instanceName: string,
  ): Promise<OpenAISettingsResponseDto> {
    const settings = await this.openAISettingsUseCase.find(instanceName);

    return {
      settings: settings!,
      message: 'Configurações OpenAI encontradas com sucesso',
    };
  }

  @Put('settings/:instanceName')
  @IsPublic()
  @ApiOperation({
    summary: 'Atualizar configurações OpenAI',
    description: 'Atualiza as configurações OpenAI da instância especificada',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiBody({
    type: CreateOpenAISettingsDto,
    description: 'Dados das configurações OpenAI',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configurações OpenAI atualizadas com sucesso',
    type: OpenAISettingsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configurações OpenAI não encontradas',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async updateSettings(
    @Param('instanceName') instanceName: string,
    @Body() updateSettingsDto: CreateOpenAISettingsDto,
  ): Promise<OpenAISettingsResponseDto> {
    const settings = await this.openAISettingsUseCase.update(instanceName, updateSettingsDto);

    return {
      settings,
      message: 'Configurações OpenAI atualizadas com sucesso',
    };
  }

  @Delete('settings/:instanceName')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletar configurações OpenAI',
    description: 'Remove as configurações OpenAI da instância',
  })
  @ApiParam({
    name: 'instanceName',
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configurações OpenAI deletadas com sucesso',
    type: OpenAISettingsDeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configurações OpenAI não encontradas',
  })
  async deleteSettings(
    @Param('instanceName') instanceName: string,
  ): Promise<OpenAISettingsDeleteResponseDto> {
    const result = await this.openAISettingsUseCase.delete(instanceName);

    return result;
  }
}
