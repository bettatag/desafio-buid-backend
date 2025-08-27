import { ApiProperty } from '@nestjs/swagger';

export class OpenAICredsEntity {
  @ApiProperty({
    description: 'ID único das credenciais OpenAI',
    example: 'creds-uuid-123',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Nome das credenciais',
    example: 'main-openai-creds',
  })
  public readonly name: string;

  @ApiProperty({
    description: 'Chave da API OpenAI (mascarada por segurança)',
    example: 'sk-proj-****...****',
  })
  public readonly apiKey: string;

  @ApiProperty({
    description: 'ID da organização OpenAI (opcional)',
    example: 'org-abc123',
    required: false,
  })
  public readonly organization?: string;

  @ApiProperty({
    description: 'Status das credenciais (ativa/inativa)',
    example: true,
  })
  public readonly enabled: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00Z',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00Z',
  })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    name: string,
    apiKey: string,
    enabled: boolean,
    createdAt: Date,
    updatedAt: Date,
    organization?: string,
  ) {
    this.id = id;
    this.name = name;
    this.apiKey = apiKey;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.organization = organization;
  }

  // Métodos de negócio
  isActive(): boolean {
    return this.enabled;
  }

  getMaskedApiKey(): string {
    if (!this.apiKey || this.apiKey.length < 8) {
      return '****';
    }
    const start = this.apiKey.substring(0, 7);
    const end = this.apiKey.substring(this.apiKey.length - 4);
    return `${start}****${end}`;
  }

  hasOrganization(): boolean {
    return !!this.organization && this.organization.trim().length > 0;
  }

  getInfo(): string {
    return `${this.name} (${this.getMaskedApiKey()})`;
  }

  static create(data: {
    id: string;
    name: string;
    apiKey: string;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    organization?: string;
  }): OpenAICredsEntity {
    return new OpenAICredsEntity(
      data.id,
      data.name,
      data.apiKey,
      data.enabled ?? true,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.organization,
    );
  }
}
