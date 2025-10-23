# Módulo Atendimento - Produção

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
clasp deploy --deploymentId AKfycbxOwmw_yCfIsvi5hEp5_ZT5ondud-0mYb81-7ii_u-R37QS3LDXv8BHZfk7FAlrfbom7A --description "Deploy Produção - Atendimento"
```

## Ambiente
- **URL**: [URL do Sistema em Produção]
- **Planilha**: [Link da Planilha de Produção]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: AKfycbxOwmw_yCfIsvi5hEp5_ZT5ondud-0mYb81-7ii_u-R37QS3LDXv8BHZfk7FAlrfbom7A

## ⚠️ Importante
Este é o ambiente de **PRODUÇÃO**. Todas as alterações aqui afetam diretamente os usuários finais. Sempre teste as mudanças em Homologação primeiro.
