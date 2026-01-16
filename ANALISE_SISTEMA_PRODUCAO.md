# 📋 Análise Funcional Completa - SisNCA (Sistema de Gestão de Prescrição de Dívida Ativa)
## Ambiente de Produção

**Data da Análise:** 16 de janeiro de 2026  
**Versão do Sistema:** Produção  
**Desenvolvido por:** DTIGD  

---

## 📑 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Arquitetura e Tecnologia](#arquitetura-e-tecnologia)
3. [Estrutura de Dados (Tabelas)](#estrutura-de-dados)
4. [Módulos do Sistema](#módulos-do-sistema)
5. [Fluxo de Negócio](#fluxo-de-negócio)
6. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
7. [Regras de Negócio](#regras-de-negócio)
8. [Segurança e Controle de Acesso](#segurança-e-controle-de-acesso)
9. [Integração de Dados](#integração-de-dados)
10. [Considerações Técnicas e Recomendações](#considerações-técnicas-e-recomendações)

---

## 🎯 Visão Geral do Sistema

### Propósito
**SisNCA** é uma solução integrada para otimizar o envio, acompanhamento e processamento de solicitações de **prescrição de dívida ativa**. O sistema conecta três perfis de usuário em um fluxo único, auditável e transparente:

- **👤 Cidadãos/Contribuintes:** Enviam pedidos online com documentação
- **⚙️ Sistema Automatizado:** Valida, organiza e notifica automaticamente
- **👩‍💼 Atendentes:** Analisam pedidos, atualizam status e finalizam processos

### Objetivo Principal
Criar um **ecossistema completo e eficiente** que transforma o processo de prescrição de dívida ativa, tornando-o mais ágil, transparente e rastreável para todos os envolvidos.

### Ambiente
- **Tipo:** Google Apps Script (WebApp)
- **Timezone:** America/Sao_Paulo
- **Runtime:** V8
- **Acesso:** ANYONE (público)
- **Ambiente:** PRODUÇÃO

---

## 🏗️ Arquitetura e Tecnologia

### Stack Técnico

| Componente | Tecnologia | Descrição |
|------------|-----------|-----------|
| **Backend** | Google Apps Script (GAS) | Lógica de negócio, processamento de dados, envio de emails |
| **Frontend** | HTML5 + CSS3 + JavaScript Vanilla | Interfaces interativas sem dependências externas (exceto Tailwind) |
| **Armazenamento** | Google Sheets | Base de dados de registros, histórico e fila de emails |
| **Storage de Arquivos** | Google Drive | Armazenamento de documentos enviados pelos cidadãos |
| **Email** | Google Apps Script MailApp | Sistema de notificações automáticas |
| **Deployment** | Clasp (Command Line Apps Script) | Deploy e versionamento do código |

### Módulos Principais

```
SisNCA (Produção)
├── Atendimento (scriptId: 1tdx4KziiwKpDJTVM6Zyt8kzt3b4KHJcoKDpWRqBMmr-lHp2eN-b_XPMy)
│   ├── Code.js              → Lógica de controle de acesso, CRUD de pedidos, fila de emails
│   ├── painel.html          → Interface do atendente com tabela de protocolos e modal de detalhes
│   └── sistema.html         → Dashboard informativo sobre o sistema
│
├── Cidadao (scriptId: 1_A8ZY0GGeqxb_0P82iSemb5PtV5vS8o9sXk-AKS2Hap5SXlQvfrtFbB6)
│   ├── Código.js            → Formulário online, envio de documentos, validações
│   ├── cidadao.html         → Formulário de solicitação com upload de arquivos
│   └── consulta.html        → Interface de consulta de protocolo
│
└── Email (scriptId: 1I5plZ-_jHEEFvJL5M7oAGyQq7jSNz3r8rpcFUKNRGWPiOHlKcd0mDtW4)
    └── Código.js            → Processamento e envio de notificações por email
```

### Permissões OAuth Utilizadas

| Escopo | Módulo(s) | Finalidade |
|--------|-----------|-----------|
| `spreadsheets` | Todos | Leitura e escrita na planilha de dados |
| `drive` | Cidadao | Criar e gerenciar pastas de documentos |
| `script.send_mail` | Atendimento, Email | Envio de notificações por email |
| `script.container.ui` | Cidadao, Atendimento | Renderização de interfaces HTML |
| `userinfo.email` | Atendimento | Identificação do usuário logado |
| `drive.readonly` | Atendimento | Acesso apenas leitura para documentos enviados |

---

## 📊 Estrutura de Dados (Tabelas)

### 1. **Tabela: Pedidos Prescrição**
Armazena todas as solicitações de prescrição de dívida ativa submetidas pelos cidadãos.

| # | Coluna | Tipo | Edição | Descrição |
|---|--------|------|--------|-----------|
| A | **Protocolo** | Texto | 🔒 Auto | Identificador único do pedido. Formato: `PGE-PRESC-AAAA-NNNN` |
| B | **Timestamp** | Data/Hora | 🔒 Auto | Data e hora exata do envio do formulário (sistema) |
| C | **NomeSolicitante** | Texto | ✏️ Sim | Nome completo do titular ou representante legal |
| D | **Email** | Email | ✏️ Sim | E-mail de contato para notificações |
| E | **Telefone** | Texto | ✏️ Sim | Telefone com DDD (ex: (91) 99999-8888) |
| F | **TipoPessoa** | Seleção | ✏️ Sim | Pessoa Física, Empresário Individual, Sócio Administrador, Procurador |
| G | **CDAs** | Texto | ✏️ Sim | Números das CDAs separados por vírgula (ex: 12345, 67890, 11223) |
| H | **LinkDocumentos** | URL | 🔒 Auto | Link para a pasta do Google Drive com os documentos anexados |
| I | **Status** | Seleção | ✏️ Atendente | `Novo`, `Em Análise`, `Pendente`, `Deferido`, `Indeferido` |
| J | **AtendenteResp** | Texto | 🔒 Sistema | Nome do atendente responsável pelo caso |
| K | **Historico** | Texto | 🔒 Sistema | Log de todas as mudanças, atualizações e observações |
| L | **DataEncerramento** | Data | 🔒 Sistema | Data em que o pedido foi finalizado (Deferido/Indeferido) |
| M | **ATTUS/SAJ** | Texto | ✏️ Atendente | Número do processo no sistema ATTUS/SAJ (reservado para integração futura) |
| N | **NomeRepresentado** | Texto | ✏️ Atendente | Nome do titular da dívida (se houver representante) |
| O | **CpfCnpjRepresentado** | Texto | ✏️ Atendente | CPF/CNPJ do titular (se houver representante) |
| P | **TipoRepresentante** | Texto | ✏️ Atendente | Advogado, Procurador, Contador, etc. |
| Q | **TipoDocumentoRepresentante** | Texto | ✏️ Atendente | RG, CPF, OAB, CREA, CRC, etc. |
| R | **NumeroDocumentoRepresentante** | Texto | ✏️ Atendente | Número do documento do representante |
| S | **OutrosDocumentos** | JSON | 🔒 Sistema | Metadados dos documentos enviados (uso interno) |

**Regras:**
- Cada linha = 1 pedido único
- Protocolos são **únicos e imutáveis**
- Timestamp é gerado automaticamente no envio
- Histórico é **append-only** (apenas adiciona novos registros)
- Status segue transição de estados definida (ver seção Regras de Negócio)

---

### 2. **Tabela: Acessos**
Controla quem tem permissão para acessar o painel de atendimento.

| # | Coluna | Tipo | Descrição |
|---|--------|------|-----------|
| A | **Nome** | Texto | Nome completo do usuário |
| B | **Email** | Email | Email corporativo (usado como identificador único) |
| C | **Role** | Seleção | `user` (atendente comum) ou `admin` (administrador) |

**Regras:**
- Email é a chave primária (case-insensitive)
- Apenas usuários nesta lista podem acessar o painel de atendimento
- Admins podem gerenciar todos os usuários (CRUD)
- Usuários comuns ('user') podem visualizar e editar protocolos
- Autenticação ocorre via `Session.getEffectiveUser()` do Google

---

### 3. **Tabela: EmailQueue**
Fila de processamento para envio de notificações por email.

| # | Coluna | Tipo | Descrição |
|---|--------|------|-----------|
| A | **Timestamp** | Data/Hora | Hora em que o email foi adicionado à fila |
| B | **Protocolo** | Texto | ID do protocolo relacionado |
| C | **Nome** | Texto | Nome do destinatário |
| D | **Email** | Email | Endereço de email do destinatário |
| E | **Status** | Texto | Novo status do pedido |
| F | **Observacao** | Texto | Observação ou mensagem a ser incluída no email |

**Regras:**
- Fila é processada automaticamente via `processEmailQueue()` (trigger time-based)
- Usa `LockService` para evitar processamento concorrente
- Após envio, registros são **removidos** (clearContent)
- Falhas de envio são registradas no Logger apenas (sem persistência)

---

## 🔄 Fluxo de Negócio

### Diagrama do Fluxo (Textual)

```
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 1: SUBMISSÃO DO CIDADÃO                                        │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Cidadão acessa o formulário (cidadao.html)                       │
│ 2. Preenche dados pessoais (nome, email, CPF, telefone, tipo)      │
│ 3. Seleciona se é titular ou representante                         │
│ 4. Anexa documentos comprobatórios                                  │
│ 5. Clica em "Enviar Solicitação"                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 2: PROCESSAMENTO AUTOMATIZADO (Backend - Cidadao)             │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Validação de dados (CPF/CNPJ, email, telefone)                  │
│ 2. Criação de pasta no Google Drive para documentos                │
│ 3. Geração de número de protocolo (PGE-PRESC-AAAA-NNNN)          │
│ 4. Inserção na tabela "Pedidos Prescrição"                         │
│ 5. Adição à fila de emails (EmailQueue)                            │
│ 6. Resposta ao cidadão com protocolo                               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 3: NOTIFICAÇÃO AUTOMÁTICA (Email)                             │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Processamento da fila de emails (processEmailQueue)             │
│ 2. Envio de confirmação com:                                        │
│    - Número do protocolo                                            │
│    - Link para consulta                                             │
│    - Dados resumidos da solicitação                                │
│ 3. Registro do envio no Logger                                      │
│ 4. Remoção da fila (clearContent)                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 4: ANÁLISE DO ATENDENTE (Painel de Atendimento)              │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Atendente faz login (validação via tabela "Acessos")            │
│ 2. Visualiza painel com tabela de protocolos                       │
│ 3. Filtra por protocolo, nome, status ou data                      │
│ 4. Clica em "Ver Detalhes" para abrir modal                        │
│ 5. Modal mostra:                                                    │
│    - Dados do titular e representante                              │
│    - CDAs associadas                                                │
│    - Link para pasta de documentos                                 │
│    - Status atual e histórico completo                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 5: PROCESSAMENTO E ATUALIZAÇÃO                                │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Atendente pode:                                                   │
│    a) Editar dados do solicitante (nome, email, telefone, etc.)    │
│    b) Atualizar status do pedido                                    │
│    c) Adicionar observação sobre a mudança                          │
│    d) Informar número do processo (ATTUS/SAJ)                      │
│ 2. Clica "Salvar Todas as Alterações"                              │
│ 3. Sistema registra no Histórico                                    │
│ 4. Se status mudou, adiciona à fila de emails                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 6: NOTIFICAÇÃO DE ATUALIZAÇÃO AO CIDADÃO                      │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Email disparado automaticamente contendo:                        │
│    - Novo status do protocolo                                       │
│    - Observação do atendente                                        │
│    - Link para consultar pedido                                     │
│ 2. Cidadão fica informado do andamento                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FASE 7: FINALIZAÇÃO (Se status = Deferido ou Indeferido)          │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Sistema registra data de encerramento automaticamente            │
│ 2. Email final é enviado ao cidadão                                │
│ 3. Protocolo fica marcado como finalizado                          │
│ 4. Atendente pode gerar PDF do protocolo para arquivo              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Funcionalidades Detalhadas

### **Módulo Cidadão (Frontend Público)**

#### 1. Formulário de Solicitação (`cidadao.html`)

**Seção 1: Identificação**
- Nome completo (obrigatório)
- Tipo de Pessoa (Pessoa Física / Empresário Individual / Sócio Administrador / Procurador)
- Email (obrigatório, validação de formato)
- Telefone (obrigatório, máscara: (XX) XXXXX-XXXX)
- CPF/CNPJ (obrigatório, com validação de dígitos)

**Seção 2: Representação (Condicional)**
- Se o usuário escolher "Procurador" ou "Representante":
  - Nome do Representado (titular da dívida)
  - CPF/CNPJ do Representado
  - Tipo de Representante (Advogado, Procurador, Contador, etc.)
  - Tipo de Documento do Representante (RG, CPF, OAB, CREA, CRC)
  - Número do Documento do Representante

**Seção 3: Documentação**
- Upload de múltiplos arquivos
- Tipos aceitos: Imagens (PNG, JPG), PDFs, Word, Excel
- Limite de tamanho: Definido pelo Google Drive (padrão: 5GB por arquivo)
- Arquivos são organizados automaticamente em pasta no Drive vinculada ao protocolo

**Seção 4: CDAs**
- Campo de entrada com validação de formato
- Múltiplas CDAs podem ser inseridas separadas por vírgula
- Validação de números

**Seção 5: Confirmação**
- Campo de aceite dos termos
- Verificação CAPTCHA (anti-spam) para envio

**Funcionalidades:**
- ✅ Validação em tempo real de CPF/CNPJ
- ✅ Máscara automática de telefone
- ✅ Feedback visual de carregamento durante envio
- ✅ Confirmação por email com número de protocolo
- ✅ Link direto para consulta de protocolo
- ✅ Indicador de progresso (barra de upload)

---

#### 2. Consulta de Protocolo (`consulta.html`)

**Funcionalidades:**
- Busca por número de protocolo
- Exibição do:
  - Status atual
  - Data da solicitação
  - Nome do solicitante
  - Histórico de movimentações
  - Data de encerramento (se já finalizado)
  - Link para documentos (se disponível)

**Fluxo:**
1. Cidadão insere número do protocolo (ex: PGE-PRESC-2024-0001)
2. Sistema busca na tabela "Pedidos Prescrição"
3. Exibe dados públicos do protocolo
4. Mostra histórico (apenas resumido para privacidade)

---

### **Módulo Atendimento (Backend + Frontend Interno)**

#### 1. Painel do Atendente (`painel.html`)

**Componente 1: Header com Informações do Usuário**
- Nome do atendente logado
- Email corporativo
- Role (user / admin)
- Link para "Visão Geral do Sistema"
- Badge indicando ambiente (HOMOLOGAÇÃO / PRODUÇÃO)

**Componente 2: Filtros e Pesquisa**
- Campo de pesquisa (por protocolo ou nome do titular)
- Dropdown de status (Todos, Novo, Em Análise, Pendente, Deferido, Indeferido)
- Trigger: `applyFilters()` ao mudar filtro ou pesquisar

**Componente 3: Tabela de Protocolos**
- Colunas: Protocolo, Data, Nome do Titular, Status, Ações
- Paginação: 10, 20, 50, 100 itens por página
- Ordenação: Por data (descendente padrão), protocolo, nome, status
- Linha selecionada: Feedback visual (hover, cor de fundo)

**Componente 4: Modal de Detalhes**
- Acionado ao clicar "Ver Detalhes"
- Carrega dados completos via `consultarProtocoloCompleto(protocolo)`

**Componente 5: Edição de Protocolo (Dentro do Modal)**

Seção A: Dados do Titular da Dívida
- Nome do Titular (editável)
- CPF/CNPJ do Titular (editável)

Seção B: Dados do Representante/Solicitante
- Nome (editável)
- Email (editável, validação)
- Telefone (editável, máscara automática)
- Tipo de Pessoa (editável)
- Tipo de Representante (editável)
- Tipo de Documento do Representante (editável)
- Número do Documento do Representante (editável)

Seção C: Dados do Pedido
- CDAs (editável, textarea para múltiplas)
- Link para Documentos (somente leitura, link clicável)
- Nº Processo ATTUS/SAJ (editável, máscara: AAAA.AA.AAAAAA)

Seção D: Andamento e Histórico
- Status (dropdown com opções)
- Observação da Alteração (textarea obrigatório)
- Botão: "Salvar Todas as Alterações"
- Botão: "Exportar para PDF"
- Campo histórico (somente leitura, pré-formatado)

**Fluxo de Edição:**
1. Atendente altera um ou mais campos
2. Adiciona observação (obrigatório)
3. Clica "Salvar"
4. Sistema valida alterações
5. Registra cada mudança no Histórico com timestamp e nome do atendente
6. Se status mudou, adiciona email à fila
7. Exibe mensagem de sucesso

**Componente 6: Painel de Gestão de Usuários (Admin Only)**

Seção A: Lista de Usuários Registrados
- Tabela com: Nome, Email, Função
- Botões de ação: Editar, Remover
- Responsivo e com scroll horizontal em mobile

Seção B: Formulário de Adicionar/Atualizar Usuário
- Nome do Usuário (texto)
- Email do Usuário (email, validação)
- Função (radio: User / Admin)
- Botão: "Adicionar/Atualizar Usuário"

**Fluxo:**
1. Admin clica em "Adicionar Novo Usuário"
2. Preenche formulário
3. Clica "Adicionar/Atualizar Usuário"
4. Se email já existe → atualiza role
5. Se não existe → cria novo usuário
6. Atualiza tabela dinamicamente
7. Mensagem de sucesso/erro

---

#### 2. Visão Geral do Sistema (`sistema.html`)

**Componente 1: Header Navegável**
- Navegação sticky com links para seções
- Links: Visão Geral, Como Funciona, Módulos, Resumo

**Componente 2: Seção Hero**
- Título: "Sistema de Gestão de Prescrição de Dívida Ativa"
- Descrição do objetivo
- Visual atrativo com gradiente

**Componente 3: Fluxo Interativo**
- 3 etapas visuais:
  1. 👤 Cidadão Inicia (Envio de pedido e documentos)
  2. ⚙️ SisNCA Processa (Valida, organiza e notifica)
  3. 👩‍💼 Atendente Analisa (Consulta, atualiza e finaliza)
- Clique em cada etapa exibe descrição detalhada
- Animações e transições suaves

**Componente 4: Módulos em Abas**
- Aba 1: Cidadão
  - Formulário Online
  - Envio de Documentos
  - Identificação Automática
  - Confirmação por E-mail
  - Validação de Dados
  
- Aba 2: Email
  - Fila de E-mails
  - Envio Automático
  - Personalização
  - Logs de Envio
  
- Aba 3: Atendimento
  - Painel do Atendente
  - Filtros e Pesquisa
  - Visualização Detalhada
  - Gestão de Andamento
  - Exportação para PDF
  - Gestão de Usuários (Admin)

**Componente 5: Resumo Final**
- Pitch do sistema como "ecossistema completo e eficiente"

---

### **Módulo Email (Backend Puro)**

#### 1. Processamento de Fila (`Código.js`)

**Função: `processEmailQueue()`**

Objetivo: Enviar emails para cidadãos quando há atualização de status

**Fluxo:**
1. Disparo: Trigger time-based (a cada X minutos) OU manual via `prepareEmailAndCreateTrigger()`
2. Lock: Usa `LockService` para evitar duplicação (espera até 30s)
3. Leitura: Lê tabela "EmailQueue" da linha 2 até última
4. Loop: Para cada email na fila:
   - Extrai: Protocolo, Nome, Email, Status, Observação
   - Constrói: Corpo HTML com template personalizado
   - Envia: Via `MailApp.sendEmail()` com subject personalizado
   - Registra: Log de sucesso ou erro
5. Limpeza: Remove todos os registros processados (clearContent)
6. Trigger: Deleta o trigger atual se foi time-based
7. Unlock: Libera lock

**Template de Email Enviado:**

```html
<p>Prezado(a) [Nome],</p>
<p>Houve uma atualização no seu pedido de Análise de Prescrição 
   (protocolo <strong>[Protocolo]</strong>).</p>
<p><strong>Novo Status:</strong> [Status]</p>
<p><strong>Observação do Atendente:</strong><br/>
   <i>[Observacao]</i></p>
<p>Você pode consultar o seu pedido a qualquer momento.</p>
<p>Atenciosamente,<br>Equipe de Atendimento</p>
```

**Remetente:** `PGE - Atendimento`

**Configuração:**
- Timezone: America/Sao_Paulo
- Encoding: UTF-8
- Retry: Não (falhas são apenas registradas no Logger)

---

## 📋 Regras de Negócio

### 1. **Transição de Estados (Status)**

```
┌─────────────────────────────────────────────────────────────┐
│ Estados Válidos: Novo → Em Análise → Pendente → Final      │
├─────────────────────────────────────────────────────────────┤
│ Novo
│  ├─→ Em Análise (Atendente inicia análise)
│  └─→ Pendente (Dados/docs incompletos)
│
│ Em Análise
│  ├─→ Pendente (Requer mais dados do cidadão)
│  ├─→ Deferido (Pedido aprovado) [Gera DataEncerramento]
│  └─→ Indeferido (Pedido negado) [Gera DataEncerramento]
│
│ Pendente
│  ├─→ Em Análise (Documentação complementada)
│  ├─→ Deferido (Análise finalizada com aprovação)
│  └─→ Indeferido (Análise finalizada com rejeição)
│
│ Deferido / Indeferido (FINAL)
│  └─→ (Apenas leitura) Pode editar anotações mas não sai deste estado
└─────────────────────────────────────────────────────────────┘
```

**Efeitos Colaterais:**
- ✅ Se `Status` muda → Sempre cria email na fila
- ✅ Se `Status` = Deferido ou Indeferido → Registra `DataEncerramento`
- ✅ Se qualquer campo muda → Registra no `Historico`
- ✅ Se `Status` muda → Histórico mostra mudança com timestamp

### 2. **Validações de Entrada**

| Campo | Validação | Ação em Erro |
|-------|-----------|------------|
| **Email** | Formato válido (contém @, domínio) | Rejeita envio |
| **Telefone** | Formato: (XX) XXXXX-XXXX | Máscara automática |
| **CPF** | 11 dígitos + validação de dígitos (módulo 11) | Alerta ao atendente |
| **CNPJ** | 14 dígitos + validação de dígitos | Alerta ao atendente |
| **CDAs** | Números separados por vírgula | Aceita qualquer número |
| **Protocolo** | Padrão: PGE-PRESC-AAAA-NNNN | Auto-gerado |

### 3. **Regras de Acesso**

| Perfil | Permissões | Restrições |
|--------|-----------|-----------|
| **Visitante Anônimo** | Ver `consulta.html`, enviar formulário | Não pode acessar painel de atendimento |
| **Atendente (user)** | Listar protocolos, editar campos, atualizar status | Não pode adicionar/remover usuários |
| **Administrador (admin)** | Tudo que o atendente + gerenciar usuários | Não pode se removar a si próprio |

### 4. **Regras de Edição**

| Campo | Pode Editar? | Quem? | Registro |
|-------|---|---|---|
| Protocolo | 🔒 Não | - | Não (gerado automaticamente) |
| Timestamp | 🔒 Não | - | Não (imutável) |
| NomeSolicitante | ✏️ Sim | Atendente | Sim (Histórico) |
| Email | ✏️ Sim | Atendente | Sim (Histórico) |
| Telefone | ✏️ Sim | Atendente | Sim (Histórico) |
| TipoPessoa | ✏️ Sim | Atendente | Sim (Histórico) |
| CDAs | ✏️ Sim | Atendente | Sim (Histórico) |
| LinkDocumentos | 🔒 Não | - | Não (auto-gerado do Drive) |
| Status | ✏️ Sim | Atendente | Sim (Histórico com timestamp) |
| AtendenteResp | 🔒 Sistema | - | Não (auto-preenchido) |
| Historico | 🔒 Append Only | Sistema | Sim (append-only) |
| DataEncerramento | 🔒 Sistema | - | Não (auto-preenchido se Deferido/Indeferido) |
| ATTUS/SAJ | ✏️ Sim | Atendente | Sim (Histórico) |
| NomeRepresentado | ✏️ Sim | Atendente | Sim (Histórico) |
| CpfCnpjRepresentado | ✏️ Sim | Atendente | Sim (Histórico) |
| TipoRepresentante | ✏️ Sim | Atendente | Sim (Histórico) |
| TipoDocumentoRepresentante | ✏️ Sim | Atendente | Sim (Histórico) |
| NumeroDocumentoRepresentante | ✏️ Sim | Atendente | Sim (Histórico) |

### 5. **Geração de Protocolo**

**Padrão:** `PGE-PRESC-AAAA-NNNN`

- **PGE**: Prefixo do órgão (Procuradoria Geral do Estado)
- **PRESC**: Tipo de solicitação (Prescrição de Dívida Ativa)
- **AAAA**: Ano atual (4 dígitos)
- **NNNN**: Número sequencial (4 dígitos, zero-padded)

**Exemplo:** `PGE-PRESC-2024-0001`, `PGE-PRESC-2024-0002`, etc.

**Geração:** Automática ao submeter formulário. Usa contador ou timestamp + número aleatório para garantir unicidade.

### 6. **Documentos no Google Drive**

**Estrutura de Pastas:**
```
Google Drive (Raiz ou Pasta Compartilhada)
├── 2024/
│   ├── 01/ (Janeiro)
│   │   ├── PGE-PRESC-2024-0001/
│   │   │   ├── documento1.pdf
│   │   │   ├── foto_cpf.jpg
│   │   │   └── contrato.pdf
│   │   └── PGE-PRESC-2024-0002/
│   │       └── ...
│   └── 02/ (Fevereiro)
│       └── ...
└── 2025/
    └── ...
```

**Regras:**
- Pasta criada automaticamente ao enviar protocolo
- Link inserido na coluna `LinkDocumentos`
- Atendente pode acessar diretamente do painel
- Documentos permanecem no Drive mesmo se protocolo for finalizado

### 7. **Histórico**

**Formato:**
```
[Data/Hora] - [Atendente]: [Descrição da Mudança]
[Data/Hora] - [Atendente]: [Nova Entrada]
---
Etapas subsequentes adicionadas como novos registros
```

**Eventos Registrados:**
- ✅ Mudança de Status
- ✅ Alteração de dados (com antes/depois)
- ✅ Adição de observações
- ✅ Alteração de ATTUS/SAJ
- ✅ Alteração de dados do representante

**Imutabilidade:** Histórico é append-only (nunca é deletado ou sobrescrito)

---

## 🔐 Segurança e Controle de Acesso

### 1. **Autenticação**

| Módulo | Mecanismo | Detalhes |
|--------|-----------|----------|
| **Atendimento** | Google OAuth + Validação em Planilha | `Session.getEffectiveUser().getEmail()` buscado na tabela "Acessos" |
| **Cidadao** | Acesso Anônimo | Webapp aberto para ANYONE_ANONYMOUS |
| **Email** | Acesso Anônimo | Webapp aberto para ANYONE_ANONYMOUS |

### 2. **Autorização**

**Painel de Atendimento:**
- Acesso: Apenas usuários na tabela "Acessos"
- Controle: Role-based (user vs admin)
- Admin: Pode gerenciar usuários + acessar todos os protocolos
- User: Pode visualizar e editar protocolos

**Gestão de Usuários:**
- Acesso: Apenas para role = `admin`
- Ação: `addOrUpdateUser()`, `removeUser()`
- Restrição: Admin não pode se removar a si próprio

### 3. **Proteção de Dados**

| Dado | Proteção | Nível |
|------|----------|-------|
| **Email do Cidadão** | Armazenado em Drive (Google's AES-128) | Alto |
| **Telefone do Cidadão** | Armazenado em Google Sheets | Alto |
| **Documentos** | Armazenados em Google Drive (Pastas exclusivas) | Alto |
| **Histórico** | Log completo em Sheets (auditável) | Alto |
| **Credenciais de Login** | Google OAuth (não armazenadas) | Muito Alto |

### 4. **Limitações Conhecidas**

⚠️ **Riscos Identificados:**

1. **Sem Criptografia de Ponta a Ponta:** Dados em Sheets são visíveis para Google (conforme ToS)
2. **Sem Auditoria Detalhada de Quem Viu O Quê:** Apenas logs de mudança, não logs de acesso
3. **Fila de Email Não Persistente:** Se falha no envio, o email é perdido (apenas logged)
4. **ATTUS/SAJ Hard-Coded:** URL é pública no código-fonte
5. **Sem Rate Limiting:** Qualquer pessoa pode enviar múltiplos formulários

### 5. **Compliance Esperado**

- ✅ LGPD: Dados pessoais armazenados em Google Cloud (Brasil data center)
- ⚠️ Retenção: Não há política de retenção de dados definida (considerar implementar)
- ✅ Rastreabilidade: Histórico completo de todas as ações
- ✅ Transparência: Cidadão pode consultar seu protocolo

---

## 🔗 Integração de Dados

### 1. **Fluxo de Dados entre Módulos**

```
┌─────────────────┐
│   Cidadão       │
│ (Formulário)    │
└────────┬────────┘
         │
         ├─→ Valida dados
         ├─→ Cria protocolo
         └─→ Insere em "Pedidos Prescrição"
                 │
                 ├─→ Cria pasta no Google Drive
                 ├─→ Adiciona email à "EmailQueue"
                 │
                 └─→ Dispara Email (processEmailQueue)
                     │
                     └─→ Envia confirmação ao cidadão
                             │
                             └─→ Cidadão recebe protocolo
                                 e link de consulta

         Depois...

                 ├─→ Atendente acessa "Acessos" (OAuth)
                 ├─→ Visualiza "Pedidos Prescrição"
                 ├─→ Edita protocolo
                 ├─→ Atualiza "Status" + Adiciona "Histórico"
                 ├─→ Adiciona email à "EmailQueue"
                 │
                 └─→ Dispara Email
                     │
                     └─→ Envia atualização ao cidadão
```

### 2. **Google Sheets como Banco de Dados**

**Vantagens:**
- ✅ Fácil visualização e edição manual
- ✅ Backup automático pelo Google
- ✅ Controle de acesso nativo (compartilhamento)
- ✅ Versioning automático

**Desvantagens:**
- ❌ Performance: Leitura de 10k+ linhas é lenta
- ❌ Escalabilidade: Limite de 5 milhões de células
- ❌ Sem índices: Busca linear em todas as operações
- ❌ Sem transações: Sem rollback em caso de erro parcial

### 3. **Google Drive para Documentos**

**Vantagens:**
- ✅ Armazenamento ilimitado (até limites da conta)
- ✅ Organização automática por pastas
- ✅ Links shareable diretamente
- ✅ Preview de documentos na web

**Desvantagens:**
- ❌ Sem integridade: Documentos podem ser movidos/deletados fora do sistema
- ❌ Sem versionamento: Só o Google Drive faz versioning
- ❌ Sem auditoria de quem acessou

### 4. **Integração com ATTUS/SAJ (Futura)**

**Campo Reservado:** `ATTUS/SAJ` na tabela "Pedidos Prescrição"

**Objetivo Futuro:**
- Integração com sistema ATTUS/SAJ da PGE
- Permitir sincronização bidirecional de status
- Validação de processos existentes

**Status Atual:** Campo apenas para entrada manual de número (placeholder)

---

## 🔧 Considerações Técnicas e Recomendações

### 1. **Escalabilidade**

**Limitação Atual:** Google Sheets com 1000+ linhas começa a ficar lento

**Cenário de Crescimento:**
- 100 protocolos/mês → 1.200/ano → Manageable
- 1.000 protocolos/mês → 12.000/ano → Começa a ter latência
- 10.000 protocolos/mês → 120.000/ano → Requer migração

**Recomendação:**
```
Se > 5.000 protocolos:
  ├─ Considerar migração para Google Cloud Firestore
  ├─ Ou usar Cloud SQL (MySQL/PostgreSQL)
  └─ Implementar indexação por protocolo, email, status, data
```

### 2. **Performance de Leitura**

**Problema Atual:**
```javascript
const data = sheet.getDataRange().getValues(); // Lê TODA a planilha
for (let i = 1; i < data.length; i++) {
  if (data[i][0] === protocolo) { ... } // Busca linear O(n)
}
```

**Impacto:** Com 10k linhas, cada busca = 10k iterações = 2-3s latência

**Otimização Recomendada:**
```javascript
// Versão otimizada:
function findProtocoloOptimizado(protocolo) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REQUESTS_SHEET_NAME);
  
  // Usar Sheets API com query
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const protocolIndex = headers.indexOf('Protocolo');
  
  // Usar CTRL+F do Sheets (mais rápido)
  const range = sheet.getRange(2, protocolIndex + 1, sheet.getLastRow() - 1, 1);
  const finder = range.createTextFinder(protocolo).matchEntireCell(true);
  const found = finder.findNext();
  
  if (found) {
    return sheet.getRange(found.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0];
  }
  return null;
}
```

### 3. **Fila de Email Robusto**

**Problema Atual:**
- Falhas de envio não são retentadas
- Emails perdidos se processamento falha
- Sem confirmação de entrega

**Recomendação:**
```javascript
// Adicionar status de email
// EmailQueue: Timestamp | Protocolo | Nome | Email | Status | Observacao | EnvioStatus | TentativasRestantes

const MAX_RETRIES = 3;
const RETRY_DELAY_MINUTES = 5;

function processEmailQueueImproved() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  
  const emailQueueSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(EMAIL_QUEUE_NAME);
  const dataRange = emailQueueSheet.getRange("A2:H" + emailQueueSheet.getLastRow());
  const data = dataRange.getValues();
  
  for (let i = 0; i < data.length; i++) {
    const status = data[i][6]; // EnvioStatus
    const tentativas = data[i][7]; // TentativasRestantes
    
    if (status === 'PENDENTE' && tentativas > 0) {
      try {
        // Enviar email...
        MailApp.sendEmail(...);
        
        // Marcar como sucesso
        emailQueueSheet.getRange(i + 2, 7).setValue('ENVIADO');
        emailQueueSheet.getRange(i + 2, 8).setValue(0);
      } catch (err) {
        // Diminuir tentativas
        emailQueueSheet.getRange(i + 2, 8).setValue(tentativas - 1);
        if (tentativas - 1 === 0) {
          emailQueueSheet.getRange(i + 2, 7).setValue('FALHOU');
        }
      }
    }
  }
  
  lock.releaseLock();
}
```

### 4. **Tratamento de Erros**

**Atual:** Muitos `throw new Error()` sem catch apropriado

**Recomendação:**
```javascript
function safeExecute(callback, fallbackValue) {
  try {
    return callback();
  } catch (error) {
    Logger.log('ERRO: ' + error.toString());
    // Enviar notificação ao admin
    sendErrorNotification(error);
    return fallbackValue;
  }
}

function sendErrorNotification(error) {
  const adminEmail = 'admin@example.com';
  MailApp.sendEmail({
    to: adminEmail,
    subject: `ERRO no SisNCA: ${new Date().toLocaleString()}`,
    htmlBody: `<p>Erro capturado:</p><pre>${error}</pre>`,
    name: 'SisNCA Sistema'
  });
}
```

### 5. **Versionamento de Código**

**Atual:** Clasp está configurado, mas sem CI/CD

**Recomendação:**
```bash
# Setup Git + Clasp
git init
git remote add origin https://github.com/ncapgepa/sisnca.git

# Deploy to Homolog
clasp push --rootDir Homologacao/Atendimento/src

# Deploy to Prod (após testes)
clasp deploy --deploymentId <ID>

# Tag de versão
git tag -a v1.0.0 -m "Release Produção - 2024-01-15"
git push origin v1.0.0
```

### 6. **Testes**

**Recomendação:** Criar script de testes para validar funções críticas

```javascript
function runTests() {
  console.log('🧪 Iniciando testes...');
  
  testProtocolGeneration();
  testValidateEmail();
  testValidateCPF();
  testFilterProtocols();
  testUpdateStatus();
  
  console.log('✅ Todos os testes passaram!');
}

function testValidateEmail() {
  const tests = [
    { email: 'valid@example.com', expected: true },
    { email: 'invalid@', expected: false },
    { email: 'noemail', expected: false }
  ];
  
  for (const test of tests) {
    const result = validateEmail(test.email);
    if (result !== test.expected) {
      throw new Error(`Email validation failed: ${test.email}`);
    }
  }
  console.log('✅ Email validation tests passed');
}
```

### 7. **Documentação Recomendada**

Criar arquivos:
- `API.md`: Documentação de endpoints/funções públicas
- `DEPLOYMENT.md`: Instruções de deploy em Prod/Homolog
- `DATABASE.md`: Schema detalhado das tabelas
- `ARCHITECTURE.md`: Diagrama arquitetura e fluxo dados
- `TROUBLESHOOTING.md`: FAQ e troubleshooting comum

### 8. **Nomes de Arquivo com Acentuação**

⚠️ **Risco:** Arquivos nomeados `Código.js` causam problemas em algumas ferramentas

**Recomendação:**
```bash
# Renomear para:
# Código.js → Codigo.js (em todos os módulos)
# Atualizar referências em appsscript.json
```

---

## 📊 Resumo Executivo

### O que é o SisNCA?
Sistema integrado para **gestão de solicitações de prescrição de dívida ativa**, conectando cidadãos, atendentes e sistema em um fluxo auditável.

### Componentes Principais
1. **Módulo Cidadão** → Formulário online + Consulta de protocolo
2. **Módulo Atendimento** → Painel de análise + Gestão de usuários
3. **Módulo Email** → Fila de notificações automáticas

### Tecnologia
- **Backend:** Google Apps Script (GAS) V8 Runtime
- **Frontend:** HTML5/CSS3/JavaScript Vanilla
- **Storage:** Google Sheets (dados) + Google Drive (documentos)
- **Timezone:** America/Sao_Paulo

### Tabelas Principais
1. **Pedidos Prescrição** → 20 colunas, 1 por solicitação
2. **Acessos** → Controle de quem pode acessar o painel
3. **EmailQueue** → Fila de envio de notificações

### Fluxo de Negócio
`Cidadão Envia` → `Sistema Valida` → `Atendente Analisa` → `Email de Atualização` → `Cidadão Informado`

### Regras de Negócio Críticas
- Status segue transição: Novo → Em Análise → Pendente → Deferido/Indeferido
- Histórico é append-only (imutável)
- Email disparado toda vez que status muda
- Documentos organizados em Google Drive por protocolo
- Acesso restrito via tabela "Acessos"

### KPIs Sugeridos
- Tempo médio de análise (Novo → Deferido/Indeferido)
- Taxa de aprovação (Deferido / Total)
- Volume mensal de protocolos
- Taxa de erro de envio de email
- Tempo de resposta do painel (latência)

### Próximos Passos (Curto Prazo)
1. ✅ Documentação de API completa
2. ✅ Testes automatizados
3. ✅ Melhoria de performance de leitura
4. ✅ Implementar retry automático em fila de email
5. ✅ Adicionar logs de auditoria detalhados

### Próximos Passos (Médio Prazo)
1. Integração com ATTUS/SAJ
2. Migração para Firestore (se > 5k protocolos/ano)
3. Dashboard com métricas e estatísticas
4. Notificações por SMS (além de email)
5. Assinatura digital de documentos

---

**Documento preparado por:** Sistema de Análise Automatizado  
**Revisão recomendada:** Trimestral ou após grandes mudanças  
**Próxima revisão:** Abril de 2026

