# Evolution Module

Este módulo foi desenvolvido seguindo os princípios da Clean Architecture, organizando o código em camadas bem definidas.

## Estrutura

```
evolution/
├── domain/                    # Camada de Domínio
│   ├── entities/             # Entidades de domínio
│   │   └── evolution.entity.ts
│   └── repositories/         # Interfaces dos repositórios
│       └── evolution.repository.interface.ts
├── application/              # Camada de Aplicação
│   ├── services/            # Interfaces e implementações de serviços
│   │   ├── evolution.service.interface.ts
│   │   └── evolution.service.ts
│   └── use-cases/           # Casos de uso
│       ├── create-evolution.use-case.ts
│       ├── delete-evolution.use-case.ts
│       ├── find-all-evolutions.use-case.ts
│       ├── find-evolution-by-id.use-case.ts
│       └── update-evolution.use-case.ts
├── infra/                   # Camada de Infraestrutura
│   └── repositories/        # Implementações dos repositórios
│       └── evolution.repository.ts
├── presentation/            # Camada de Apresentação
│   ├── controllers/         # Controladores REST
│   │   └── evolution.controller.ts
│   └── dtos/               # Data Transfer Objects
│       ├── create-evolution-instance.dto.ts
│       ├── evolution-response.dto.ts
│       └── update-evolution.dto.ts
├── evolution.module.ts      # Módulo NestJS
├── index.ts                # Barrel exports
└── README.md               # Documentação
```

## Funcionalidades

O módulo Evolution fornece um CRUD completo:

- **POST /evolutions** - Criar uma nova evolution
- **GET /evolutions** - Listar todas as evolutions
- **GET /evolutions/:id** - Buscar evolution por ID
- **PATCH /evolutions/:id** - Atualizar evolution
- **DELETE /evolutions/:id** - Deletar evolution

## Modelo de Dados

```typescript
interface Evolution {
  id: string;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Clean Architecture

### Camada de Domínio
- **Entities**: Contém a lógica de negócio pura
- **Repository Interfaces**: Define contratos para acesso a dados

### Camada de Aplicação
- **Use Cases**: Implementa regras de negócio específicas
- **Services**: Orquestra use cases e fornece interface simplificada

### Camada de Infraestrutura
- **Repositories**: Implementa acesso a dados usando Prisma

### Camada de Apresentação
- **Controllers**: Expõe endpoints REST
- **DTOs**: Define estruturas de entrada e saída

## Injeção de Dependência

O módulo usa constantes para tokens de injeção de dependência:

```typescript
// src/shared/constants/di-constants.ts
export const EVOLUTION_REPOSITORY = Symbol('EVOLUTION_REPOSITORY');
```

## Uso

O módulo está registrado no `AppModule` e todas as rotas estão disponíveis sob o prefixo `/evolutions`.
