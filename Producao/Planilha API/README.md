# Módulo Planilha API - Produção

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
clasp deploy --deploymentId AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg --description "Deploy Produção - Planilha API"
```

## Ambiente
- **URL**: [URL do Sistema em Produção]
- **Planilha**: [Link da Planilha de Produção]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg

## ⚠️ Importante
Este é o ambiente de **PRODUÇÃO**. Todas as alterações aqui afetam diretamente os usuários finais. Sempre teste as mudanças em Homologação primeiro.
