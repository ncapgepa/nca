# SisNCA - Sistema de Notificação e Cobrança Administrativa

Sistema integrado composto por módulos complementares desenvolvidos em Google Apps Script para gerenciamento de notificações e cobranças administrativas.

## Estrutura do Projeto

```
SisNCA Completo/
├── Homologacao/               # Ambiente de testes e validação
│   ├── Atendimento/          # Módulo de atendimento ao contribuinte
│   │   └── src/
│   │       ├── Code.js       # Lógica principal do atendimento
│   │       ├── painel.html   # Interface do painel do atendente
│   │       └── sistema.html  # Interface principal do sistema
│   ├── Cidadao/             # Módulo de interação com o cidadão
│   │   └── src/
│   │       ├── Código.js    # Lógica de processamento de solicitações
│   │       ├── cidadao.html # Formulário para cidadãos
│   │       └── consulta.html # Interface de consulta de processos
│   ├── Email/               # Módulo de comunicação por e-mail
│   │   └── src/
│   │       └── Código.js    # Lógica de envio e processamento de e-mails
│   └── Planilha API/        # API para integração com planilhas
│       └── src/
│           ├── Código.js    # Lógica de manipulação de dados
│           └── crud.html    # Interface de gerenciamento
├── Producao/                # Ambiente de produção
│   └── [Mesma estrutura do ambiente de Homologação]
├── deploy-homol-prod.ps1    # Script de automação de deploy
└── Comandos IA.txt         # Comandos e instruções para deploy
```

## Módulos do Sistema

### 1. Módulo Atendimento
- **Função**: Interface para atendentes realizarem atendimento ao contribuinte
- **Principais recursos**: 
  - Painel de atendimento
  - Gerenciamento de solicitações
  - Histórico de atendimentos

### 2. Módulo Cidadão
- **Função**: Interface pública para cidadãos solicitarem serviços
- **Principais recursos**:
  - Formulário de solicitações
  - Consulta de processos
  - Notificações automáticas

### 3. Módulo Email
- **Função**: Gerenciamento de comunicações via e-mail
- **Principais recursos**:
  - Envio automatizado de notificações
  - Templates de e-mail
  - Controle de envios

### 4. Módulo Planilha API
- **Função**: Gerenciamento de dados em planilhas Google
- **Principais recursos**:
  - CRUD de dados
  - Interface de administração
  - Integração com outros módulos

## Ambientes

### Homologação
- Ambiente para testes e validação de novas funcionalidades
- URL Base: [Inserir URL de Homologação]
- IDs de Deploy:
  - Atendimento: [ID]
  - Cidadão: [ID]
  - Email: [ID]
  - Planilha API: [ID]

### Produção
- Ambiente de produção com acesso público
- URL Base: [Inserir URL de Produção]
- IDs de Deploy:
  - Atendimento: [ID]
  - Cidadão: [ID]
  - Email: [ID]
  - Planilha API: [ID]

## Fluxo de Deploy

1. Desenvolvimento de novas funcionalidades
2. Deploy no ambiente de Homologação
3. Testes e validação
4. Deploy no ambiente de Produção

### Comandos de Deploy

O sistema utiliza o `clasp` do Google Apps Script para gerenciamento de código e deploys. Os principais comandos estão documentados no arquivo `Comandos IA.txt` e podem ser executados via terminal:

- `dpl-atend`: Deploy do módulo Atendimento
- `dpl-cid`: Deploy do módulo Cidadão
- `dpl-email`: Deploy do módulo Email
- `dpl-all`: Deploy de todos os módulos

Para automatizar o processo completo de deploy (Homologação -> Produção), utilize o script:
```powershell
./deploy-homol-prod.ps1
```

## Planilha e Drive Google

### Planilha Principal
- **Homologação**: [Link da Planilha de Homologação]
- **Produção**: [Link da Planilha de Produção]

### Pasta do Drive
- **Homologação**: [Link da Pasta de Homologação]
- **Produção**: [Link da Pasta de Produção]

## Manutenção

1. **Atualizações**: Documentar todas as alterações no arquivo `Atualizacoes.txt` de cada módulo
2. **Backup**: Realizar backup regular dos scripts e planilhas
3. **Versionamento**: Manter o código atualizado no repositório Git

## Contribuição

1. Crie uma branch para sua feature
2. Desenvolva e teste no ambiente de Homologação
3. Solicite review do código
4. Após aprovação, faça deploy em Produção

## Suporte

Para questões técnicas ou problemas, contate a equipe de desenvolvimento.
