# 📋 EXPLICAÇÃO DOS MÉTODOS DA `EvolutionInstanceEntity`

A `EvolutionInstanceEntity` é uma **Entity Rica** que encapsula não apenas dados, mas também **regras de negócio** e **comportamentos** relacionados a uma instância do Evolution API. Aqui estão todos os métodos:

---

## 🔍 MÉTODOS DE VALIDAÇÃO E STATUS

### 1. `isActive(): boolean` (Linha 25-27)
```typescript
isActive(): boolean {
  return this.instance.status === 'ACTIVE';
}
```
- **📝 O que faz:** Verifica se a instância está ativa
- **🎯 Uso:** Validações de negócio, logs, dashboards
- **✅ Exemplo:** `if (instance.isActive()) { /* pode processar mensagens */ }`

### 2. `isValid(): boolean` (Linha 63-70)
```typescript
isValid(): boolean {
  return (
    !!this.instance.instanceName?.trim() &&
    !!this.instance.instanceId?.trim() &&
    !!this.instance.access_token_wa_business?.trim() &&
    !!this.hash.apikey?.trim()
  );
}
```
- **📝 O que faz:** Valida se todos os campos obrigatórios estão preenchidos
- **🎯 Uso:** Validação antes de salvar, verificação de integridade
- **✅ Exemplo:** `if (!instance.isValid()) { throw new Error('Dados inválidos') }`

### 3. `hasValidWebhook(): boolean` (Linha 41-45)
```typescript
hasValidWebhook(): boolean {
  return (
    !!this.instance.webhook_wa_business && 
    this.instance.webhook_wa_business.trim().length > 0
  );
}
```
- **📝 O que faz:** Verifica se o webhook está configurado e válido
- **🎯 Uso:** Validação antes de enviar notificações
- **✅ Exemplo:** `if (instance.hasValidWebhook()) { /* pode enviar webhook */ }`

---

## 🔧 MÉTODOS DE CONFIGURAÇÃO E COMPORTAMENTO

### 4. `canReceiveCalls(): boolean` (Linha 33-35)
```typescript
canReceiveCalls(): boolean {
  return !this.settings.reject_call;
}
```
- **📝 O que faz:** Verifica se a instância aceita chamadas telefônicas
- **🎯 Uso:** Lógica de rejeição de chamadas
- **✅ Exemplo:** `if (!instance.canReceiveCalls()) { /* rejeitar chamada */ }`

### 5. `isAlwaysOnline(): boolean` (Linha 37-39)
```typescript
isAlwaysOnline(): boolean {
  return this.settings.always_online;
}
```
- **📝 O que faz:** Verifica se a instância deve aparecer sempre online
- **🎯 Uso:** Controle de presença no WhatsApp
- **✅ Exemplo:** `if (instance.isAlwaysOnline()) { /* manter status online */ }`

### 6. `canReadMessages(): boolean` (Linha 47-49)
```typescript
canReadMessages(): boolean {
  return this.settings.read_messages;
}
```
- **📝 O que faz:** Verifica se deve marcar mensagens como lidas automaticamente
- **🎯 Uso:** Automação de leitura de mensagens
- **✅ Exemplo:** `if (instance.canReadMessages()) { /* marcar como lida */ }`

### 7. `canReadStatus(): boolean` (Linha 51-53)
```typescript
canReadStatus(): boolean {
  return this.settings.read_status;
}
```
- **📝 O que faz:** Verifica se deve ler status/stories automaticamente
- **🎯 Uso:** Automação de visualização de status
- **✅ Exemplo:** `if (instance.canReadStatus()) { /* visualizar status */ }`

### 8. `shouldIgnoreGroups(): boolean` (Linha 55-57)
```typescript
shouldIgnoreGroups(): boolean {
  return this.settings.groups_ignore;
}
```
- **📝 O que faz:** Verifica se deve ignorar mensagens de grupos
- **🎯 Uso:** Filtro de mensagens de grupo
- **✅ Exemplo:** `if (instance.shouldIgnoreGroups() && isGroup) { /* ignorar */ }`

---

## 📄 MÉTODOS DE INFORMAÇÃO

### 9. `getInstanceInfo(): string` (Linha 29-31)
```typescript
getInstanceInfo(): string {
  return `${this.instance.instanceName} (${this.instance.instanceId})`;
}
```
- **📝 O que faz:** Retorna informação formatada da instância
- **🎯 Uso:** Logs, exibição em interfaces, debug
- **✅ Exemplo:** `console.log(instance.getInstanceInfo())` → `"test-instance (5511999887766)"`

### 10. `getCallRejectionMessage(): string` (Linha 59-61)
```typescript
getCallRejectionMessage(): string {
  return this.settings.msg_call || 'Chamadas não são aceitas nesta instância';
}
```
- **📝 O que faz:** Retorna a mensagem personalizada para rejeição de chamadas
- **🎯 Uso:** Resposta automática ao rejeitar chamadas
- **✅ Exemplo:** `sendMessage(caller, instance.getCallRejectionMessage())`

---

## 🏭 MÉTODO FACTORY

### 11. `static create(data): EvolutionInstanceEntity` (Linha 72-94)
```typescript
static create(data: {...}): EvolutionInstanceEntity {
  return new EvolutionInstanceEntity(data.instance, data.hash, data.settings);
}
```
- **📝 O que faz:** Factory method para criar instâncias da Entity
- **🎯 Uso:** Criação controlada e padronizada de objetos
- **✅ Vantagens:**
  - ✅ Validação centralizada
  - ✅ Construção simplificada
  - ✅ Padrão Factory aplicado

---

## 🎯 VANTAGENS DESTA ENTITY RICA:

### 1. 🧠 Encapsulamento de Regras de Negócio
- Lógica de negócio fica na Entity, não espalhada pelo código
- Métodos expressivos e auto-documentados

### 2. 🔒 Princípio da Responsabilidade Única
- Cada método tem uma responsabilidade específica
- Facilita testes unitários

### 3. 🎨 Clean Code
- Nomes expressivos (`canReceiveCalls()` vs `!reject_call`)
- Código mais legível e manutenível

### 4. 🔄 Reutilização
- Métodos podem ser usados em qualquer lugar do sistema
- Evita duplicação de lógica

### 5. 🧪 Testabilidade
- Cada método pode ser testado isoladamente
- Lógica de negócio testável sem dependências externas

---

## 💡 EXEMPLO DE USO PRÁTICO:

```typescript
// No UseCase
const instance = await repository.create(input);

// Validações usando métodos da Entity
if (!instance.isActive()) {
  throw new Error('Instância não ativada');
}

if (!instance.hasValidWebhook()) {
  logger.warn(`Webhook inválido: ${instance.getInstanceInfo()}`);
}

// Lógica de negócio
if (isIncomingCall && !instance.canReceiveCalls()) {
  await whatsapp.rejectCall(caller, instance.getCallRejectionMessage());
}

if (isMessage && instance.canReadMessages()) {
  await whatsapp.markAsRead(messageId);
}
```

**🏆 Esta é uma implementação exemplar de Domain-Driven Design com Entity Rica!** 🚀
