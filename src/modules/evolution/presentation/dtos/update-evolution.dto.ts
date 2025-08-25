import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateEvolutionDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    version?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}