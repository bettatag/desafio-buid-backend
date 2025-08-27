# Desafio Técnico – Desenvolvedor Fullstack

Desafio
 
Técnico:
 
Desenvolvedor(a)
 
Fullstack
 
-
 
Integração
 
WhatsApp
 
&
 
IA
 
Visão
 
Geral
 
Este
 
desafio
 
tem
 
como
 
objetivo
 
avaliar
 
suas
 
habilidades
 
no
 
desenvolvimento
 
de
 
uma
 
aplicação
 
Fullstack
 
que
 
integra
 
o
 
WhatsApp
 
com
 
inteligência
 
artificial
 
(IA).
 
Você
 
irá
 
construir
 
uma
 
solução
 
completa,
 
desde
 
a
 
conexão
 
com
 
o
 
WhatsApp
 
até
 
a
 
geração
 
de
 
respostas
 
inteligentes
 
usando
 
uma
 
API
 
de
 
IA.
 
Objetivo
 
Principal
 
Desenvolver
 
uma
 
aplicação
 
que:
 
1.
 
Conecte-se
 
ao
 
WhatsApp:
 
Através
 
de
 
QRCode
 
e
 
Pairing
 
Code.
 
2.
 
Monitore
 
Chats:
 
Leia
 
e
 
armazene
 
as
 
mensagens
 
recebidas.
 
3.
 
Responda
 
Inteligente:
 
Utilize
 
IA
 
para
 
gerar
 
e
 
enviar
 
respostas
 
automáticas
 
contextuais.
 
Requisitos
 
Técnicos
 
Essenciais
 
●
 
Frontend:
 
Next.js
 
+
 
TypeScript
 
●
 
Backend:
 
NestJS
 
+
 
TypeScript
 
●
 
Banco
 
de
 
Dados:
 
PostgreSQL
 
●
 
Integração
 
com
 
IA:
 
API
 
Externa
 
(OpenAI,
 
Gemini,
 
etc.)
 
Observação:
 
A
 
utilização
 
de
 
bibliotecas
 
e
 
ferramentas
 
adicionais
 
é
 
permitida
 
e
 
encorajada,
 
desde
 
que
 
a
 
base
 
do
 
projeto
 
respeite
 
a
 
stack
 
definida
 
acima.
 
Entregáveis
 
e
 
Funcionalidades
 
Esperadas
 
1.
 
Integração
 
com
 
WhatsApp
 
●
 
Conexão
 
Robusta:
 
Implementar
 
conexão
 
via
 
QRCode
 
e/ou
 
Pairing
 
Code,
 
com
 
tratamento
 
de
 
erros
 
e
 
reconexão
 
automática.
 
●
 
Persistência
 
de
 
Dados:
 
Registrar
 
todas
 
as
 
mensagens
 
recebidas
 
no
 
banco
 
de
 
dados,
 
associando-as
 
ao
 
usuário
 
e
 
à
 
sessão
 
do
 
WhatsApp.
 
●
 
Envio
 
Automático:
 
Enviar
 
as
 
respostas
 
geradas
 
pela
 
IA
 
de
 
forma
 
automática
 
e
 
eficiente.
 

2.
 
Processamento
 
Inteligente
 
com
 
IA
 
●
 
Geração
 
de
 
Respostas:
 
Integrar
 
com
 
uma
 
API
 
de
 
IA
 
para
 
criar
 
respostas
 
relevantes
 
e
 
personalizadas
 
com
 
base
 
no
 
conteúdo
 
da
 
mensagem
 
recebida.
 
●
 
Otimização
 
de
 
Custos:
 
Implementar
 
estratégias
 
eficazes
 
para
 
minimizar
 
o
 
consumo
 
de
 
tokens
 
da
 
API
 
de
 
IA:
 
○
 
Resumo
 
do
 
contexto
 
da
 
conversa.
 
○
 
Armazenamento
 
e
 
reutilização
 
do
 
histórico
 
da
 
conversa.
 
○
 
Cache
 
de
 
respostas
 
frequentes.
 
●
 
Gerenciamento
 
de
 
Contexto:
 
Manter
 
o
 
contexto
 
da
 
conversa
 
para
 
gerar
 
respostas
 
mais
 
coerentes
 
e
 
relevantes.
 
3.
 
Interface
 
Web
 
Amigável
 
(Frontend)
 
●
 
Autenticação:
 
Tela
 
de
 
login/conexão
 
intuitiva
 
para
 
o
 
WhatsApp
 
(via
 
QRCode
 
ou
 
Pairing
 
Code).
 
●
 
Visualização
 
Clara:
 
Interface
 
para
 
visualizar
 
as
 
mensagens
 
recebidas
 
e
 
as
 
respostas
 
enviadas,
 
organizadas
 
por
 
chat.
 
●
 
Status
 
da
 
Conexão:
 
Exibir
 
o
 
status
 
da
 
conexão
 
com
 
o
 
WhatsApp
 
(conectado,
 
desconectado,
 
etc.).
 
4.
 
Arquitetura
 
Backend
 
Sólida
 
●
 
Modularização:
 
Organização
 
clara
 
do
 
código
 
em
 
módulos
 
NestJS
 
(TypeScript),
 
seguindo
 
princípios
 
de
 
Clean
 
Architecture.
 
●
 
Modelagem
 
de
 
Dados:
 
Modelagem
 
eficiente
 
do
 
banco
 
de
 
dados
 
PostgreSQL
 
para
 
armazenar
 
usuários,
 
sessões
 
do
 
WhatsApp,
 
mensagens
 
e
 
histórico
 
de
 
conversas.
 
●
 
Escalabilidade:
 
Design
 
da
 
aplicação
 
considerando
 
a
 
escalabilidade
 
e
 
a
 
facilidade
 
de
 
manutenção
 
a
 
longo
 
prazo.
 
Critérios
 
de
 
Avaliação
 
Serão
 
considerados
 
os
 
seguintes
 
aspectos:
 
●
 
Qualidade
 
do
 
Código
 
(40%):
 
○
 
Legibilidade,
 
organização
 
e
 
aderência
 
a
 
boas
 
práticas
 
de
 
programação
 
(Clean
 
Code,
 
SOLID,
 
etc.).
 
○
 
Utilização
 
adequada
 
dos
 
recursos
 
do
 
TypeScript.
 
●
 
Arquitetura
 
e
 
Escalabilidade
 
(25%):
 
○
 
Design
 
da
 
aplicação
 
que
 
facilita
 
a
 
manutenção,
 
o
 
teste
 
e
 
a
 
expansão
 
futura.
 
○
 
Escolha
 
de
 
padrões
 
de
 
projeto
 
adequados.
 

●
 
Performance
 
e
 
Eficiência
 
(15%):
 
○
 
Tempo
 
de
 
resposta
 
da
 
aplicação.
 
○
 
Consumo
 
de
 
recursos
 
(memória,
 
CPU).
 
○
 
Otimização
 
do
 
uso
 
da
 
API
 
de
 
IA.
 
●
 
Interface
 
do
 
Usuário
 
(10%):
 
○
 
Usabilidade,
 
clareza
 
e
 
responsividade
 
da
 
interface
 
web.
 
○
 
Experiência
 
do
 
usuário
 
intuitiva.
 
●
 
Integração
 
com
 
IA
 
(10%):
 
○
 
Qualidade
 
das
 
respostas
 
geradas
 
pela
 
IA.
 
○
 
Estratégias
 
de
 
minimização
 
de
 
custos
 
(tokens).
 
Diferenciais
 
(O
 
que
 
te
 
Destaca)
 
●
 
Dockerização:
 
Utilização
 
de
 
Docker
 
para
 
simplificar
 
a
 
configuração
 
e
 
execução
 
da
 
aplicação.
 
●
 
Documentação
 
Completa:
 
README
 
claro
 
e
 
conciso
 
com
 
instruções
 
detalhadas
 
de
 
execução,
 
configuração
 
e
 
arquitetura
 
do
 
projeto.
 
●
 
Testes
 
Automatizados:
 
Implementação
 
de
 
testes
 
unitários
 
e/ou
 
de
 
integração
 
para
 
garantir
 
a
 
qualidade
 
e
 
a
 
estabilidade
 
do
 
código.
 
●
 
Deploy
 
em
 
Nuvem:
 
Deploy
 
funcional
 
da
 
aplicação
 
em
 
uma
 
plataforma
 
de
 
nuvem
 
(Vercel,
 
Railway,
 
Render,
 
etc.).
 
●
 
Funcionalidades
 
Extras:
 
Implementação
 
de
 
funcionalidades
 
adicionais
 
que
 
demonstrem
 
criatividade
 
e
 
um
 
profundo
 
entendimento
 
do
 
problema
 
(ex:
 
análise
 
de
 
sentimentos,
 
etc.).
 
Entrega
 
●
 
Compartilhe
 
o
 
link
 
do
 
seu
 
repositório
 
Git
 
(GitHub,
 
GitLab,
 
etc.)
 
contendo
 
o
 
código
 
fonte
 
completo,
 
a
 
documentação
 
e
 
as
 
instruções
 
de
 
execução.
 
●
 
Atenção:
 
A
 
originalidade
 
é
 
fundamental.
 
Evite
 
utilizar
 
modelos
 
prontos
 
ou
 
soluções
 
genéricas,
 
pois
 
isso
 
poderá
 
desqualificá-lo(a).
 
Demonstre
 
suas
 
habilidades
 
e
 
seu
 
próprio
 
raciocínio
 
na
 
resolução
 
do
 
desafio.
 
Boa
 
sorte!
 

