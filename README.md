# 🚀 Desafio Técnico - BUID

Bem-vindo ao repositório do **Desafio Técnico - BUID**.  
Este projeto foi desenvolvido com o objetivo de demonstrar habilidades práticas em **integração de sistemas, backend, frontend** e orquestração de processos.

---

## 📌 PROJETO BASE

O projeto conta com um **Agente de Vendas SDR** construído no **[n8n](https://n8n.io/)**, em execução em uma **VPS da Hostinger**.  
Esse agente simula um consultor de soluções da **BUID** e está disponível para contato direto por WhatsApp.

👉 **Número do Agente SDR:**  
[**+55 11 5196-0238**](https://wa.me/5511912345678?text=Ol%C3%A1%20quero%20falar%20com%20o%20suporte)  

### 📝 Descrição

Foi criada uma **VPS na Hostinger** utilizando o plano **KVM 4** com **Ubuntu 24.04 LTS**.  
Nela, foi executado o **script disponível em [oriondesign.art.br](https://oriondesign.art.br/)** para provisionar automaticamente o ambiente com diversas aplicações em **Docker**.

Todas as aplicações foram configuradas para rodar em **Docker Swarm**.  

#### 🐳 O que é o Docker Swarm?

O **Docker Swarm** é o **orquestrador nativo do Docker**, responsável por gerenciar múltiplos containers em cluster.  
Com ele, é possível:

- Executar serviços de forma distribuída em diferentes nós.  
- Garantir **alta disponibilidade** (replicação de serviços).  
- Escalar aplicações horizontalmente com poucos comandos.  
- Facilitar **atualizações** e **rollback** de containers.  

No contexto deste projeto, o Swarm é usado para manter os serviços críticos sempre ativos e organizados em **tasks** (unidades de execução de containers).

---

#### ⚙️ Serviços e suas Tasks

**🔹 Traefik** – Proxy reverso e balanceador de carga  
- `traefik_traefik.1`  

**🔹 Portainer + Agent** – Gerenciamento visual dos containers  
- `portainer_portainer.1`  
- `portainer_agent`  

**🔹 n8n** – Plataforma de automação de workflows  
- `n8n_n8n_editor.1` → Editor visual  
- `n8n_n8n_webhook.1` → Captura e roteamento de webhooks  
- `n8n_n8n_worker.1` → Execução de jobs  
- `n8n_n8n_redis.1` → Redis de suporte  

**🔹 PostgreSQL** – Bancos de dados relacionais  
- `postgres_postgres.1`  
- `pgvector_pgvector.1` (extensão para IA e vetores)  

**🔹 Redis** – Armazenamento em memória para cache e filas  
- `evolution_evolution_redis.1`  
- `chatwoot_chatwoot_redis.1`  

**🔹 Evolution API** – Middleware de integração com WhatsApp  
- `evolution_evolution_api.1`  

**🔹 Chatwoot** – Plataforma de atendimento multicanal  
- `chatwoot_chatwoot_app.1`  
- `chatwoot_chatwoot_app.2`  
- `chatwoot_chatwoot_sidekiq.1`  
- `chatwoot_chatwoot_sidekiq.2`  
- `chatwoot_chatwoot_sidekiq.3`  

---

#### 🌍 URL em Produção

As aplicações e serviços podem ser acessados diretamente em produção por meio dos **domínios e subdomínios configurados na Hostinger**:  

- **n8n:** [https://n8n.pramimavagaedele.com.br/](https://n8n.pramimavagaedele.com.br/)  
- **Chatwoot:** [https://chatwoot.pramimavagaedele.com.br/](https://chatwoot.pramimavagaedele.com.br/)  
- **Evolution API (Manager):** [https://evolution.pramimavagaedele.com.br/manager/](https://evolution.pramimavagaedele.com.br/manager/)  
- **Portainer:** [https://portainer.pramimavagaedele.com.br/](https://portainer.pramimavagaedele.com.br/)  

---

## 📊 Fluxo de Execução

O **fluxo principal do n8n** foi construído para atuar como **Agente SDR**, recebendo e processando mensagens vindas do WhatsApp através da **Evolution API**.  

### 🔄 Etapas do fluxo

1. **Webhook de Entrada**  
   - Captura mensagens recebidas no WhatsApp.  
   - Dispara o fluxo no n8n.  

2. **Validação de Dados**  
   - Verifica se a mensagem contém informações úteis.  
   - Identifica o contato e registra no banco de dados.  

3. **Integração com OpenAI**  
   - A mensagem é enviada para a API da OpenAI.  
   - O modelo gera uma resposta contextualizada e natural.  

4. **Registro em Banco de Dados**  
   - Informações da interação são salvas no **Postgres**.  
   - Armazenamento estruturado de histórico de leads.  

5. **Encaminhamento ao Chatwoot**  
   - Se necessário, o lead é transferido automaticamente para um atendente humano.  

6. **Resposta ao Cliente**  
   - A resposta é devolvida ao usuário via **Evolution API** → WhatsApp.  

### 🖼️ Prints do fluxo

![Fluxo n8n 1](./fluxo-n8n-1.png)  
![Fluxo n8n 2](./fluxo-n8n-2.png)  
![Fluxo n8n 3](./fluxo-n8n-3.png)  
![Fluxo n8n 4](./fluxo-n8n-4.png)  

### 🎯 Objetivo do fluxo
Esse processo garante que cada cliente receba uma **primeira interação rápida e personalizada**, funcionando como filtro inteligente antes de direcionar para o time de vendas da **BUID**.  

---

## ⚙️ BACKEND

- API desenvolvida em **NestJS**  
- Integração com **Evolution API** para comunicação via WhatsApp  
- Integração com **OpenAI** para geração de respostas inteligentes  
- Banco de dados: **PostgreSQL**  
- ORM: **Prisma**  
- Deploy: **Railway**

---

## 💻 FRONTEND

- Aplicação construída em **Next.js 14**  
- Estilização com **Tailwind CSS**  
- Autenticação com **JWT + Cookies**  
- Tela de **Login e Cadastro de Usuário**  
- Consumo da API para gerenciamento de interações com o agente  
- Deploy: **Vercel**

---

## 📝 Observações

Este repositório faz parte do desafio técnico proposto pela **BUID**.  
O foco foi manter uma arquitetura organizada, escalável e de fácil manutenção, seguindo boas práticas de **Clean Architecture**.
