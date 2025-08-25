import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EvolutionService } from '../../application/services/evolution.service';
import { CreateEvolutionDto } from '../dtos/create-evolution.dto';
import { EvolutionResponseDto } from '../dtos/evolution-response.dto';
import { UpdateEvolutionDto } from '../dtos/update-evolution.dto';

@Controller('evolutions')
export class EvolutionController {
  constructor(private readonly evolutionService: EvolutionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEvolutionDto: CreateEvolutionDto): Promise<EvolutionResponseDto> {
    const evolution = await this.evolutionService.create(createEvolutionDto);
    return EvolutionResponseDto.from(evolution);
  }

  @Get()
  async findAll(): Promise<EvolutionResponseDto[]> {
    const evolutions = await this.evolutionService.findAll();
    return EvolutionResponseDto.fromArray(evolutions);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EvolutionResponseDto> {
    const evolution = await this.evolutionService.findById(id);
    return EvolutionResponseDto.from(evolution);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEvolutionDto: UpdateEvolutionDto,
  ): Promise<EvolutionResponseDto> {
    const evolution = await this.evolutionService.update(id, updateEvolutionDto);
    return EvolutionResponseDto.from(evolution);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.evolutionService.delete(id);
  }
}
