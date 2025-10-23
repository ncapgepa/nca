# Módulo Atendimento - Homologação

Sistema de atendimento ao contribuinte para gestão de solicitações e análises de prescrição de dívida ativa.

## Estrutura do Módulo
```
Atendimento/
├── src/
│   ├── Code.js         # Lógica principal do sistema
│   ├── painel.html     # Interface do painel do atendente
│   ├── sistema.html    # Interface principal do sistema
│   └── appsscript.json # Configurações do projeto
└── Atualizacoes.txt    # Log de alterações
```

## Funcionalidades

### Painel do Atendente (`painel.html`)
- Dashboard com solicitações pendentes
- Análise de documentos enviados
- Histórico de atendimentos
- Gestão de status das solicitações

### Sistema Principal (`sistema.html`)
- Interface de gerenciamento
- Consulta de processos
- Emissão de pareceres
- Relatórios e estatísticas

## Integrações
- **Planilha API**: Armazenamento e consulta de dados
- **Módulo Email**: Notificações automáticas
- **Módulo Cidadão**: Recebimento de solicitações

## Deploy
```bash
# Deploy via clasp
clasp push
clasp deploy --deploymentId <ID_DEPLOY> --description "Deploy Homologação - Atendimento"
```

## Ambiente
- **URL**: [URL do Sistema em Homologação]
- **Planilha**: [Link da Planilha de Homologação]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: [ID de Deploy]

## Testes e Validação
1. Acesso ao sistema
2. Recebimento de solicitações
3. Análise de documentos
4. Emissão de pareceres
5. Envio de notificações
