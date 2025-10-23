# Módulo Planilha API - Homologação

API para integração e gerenciamento de dados em planilhas Google, servindo como banco de dados do sistema.

## Estrutura do Módulo
```
Planilha API/
├── src/
│   ├── Código.js      # Lógica de CRUD e integrações
│   ├── crud.html      # Interface de administração
│   └── appsscript.json # Configurações do projeto
└── Atualizacoes.txt   # Log de alterações
```

## Funcionalidades

### API de Dados
- Create: Inserção de novos registros
- Read: Consulta de dados
- Update: Atualização de registros
- Delete: Remoção de registros

### Interface de Administração (`crud.html`)
- Visualização de dados
- Edição direta
- Filtros e busca
- Exportação

## Estrutura da Planilha

### Aba Solicitações
- Protocolo
- Data/Hora
- CPF/CNPJ
- Nome
- Email
- Telefone
- Tipo de Pessoa
- Status
- CDAs
- Documentos
- Análise
- Parecer

### Aba Atendentes
- ID
- Nome
- Email
- Perfil
- Status

### Aba Configurações
- Parâmetros do sistema
- Mensagens padrão
- IDs de deploy
- URLs

## Integrações
- **Módulo Cidadão**: Registro de solicitações
- **Módulo Atendimento**: Consulta e atualização
- **Módulo Email**: Dados para notificações

## Deploy
```bash
# Deploy via clasp
clasp push
clasp deploy --deploymentId <ID_DEPLOY> --description "Deploy Homologação - Planilha API"
```

## Ambiente
- **URL**: [URL do Sistema em Homologação]
- **Planilha**: [Link da Planilha de Homologação]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: [ID de Deploy]

## Testes
1. CRUD de registros
2. Integrações com módulos
3. Permissões de acesso
4. Validações de dados
5. Interface administrativa
