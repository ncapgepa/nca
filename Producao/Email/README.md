# Módulo Email - Produção

Sistema de comunicação automatizada por e-mail para notificações e envio de protocolos.

## Estrutura do Módulo
```
Email/
├── src/
│   ├── Código.js      # Lógica de envio de emails
│   └── appsscript.json # Configurações do projeto
└── Atualizacoes.txt   # Log de alterações
```

## Funcionalidades

### Sistema de E-mail
- Envio automatizado de protocolos
- Notificações de status
- Alertas para atendentes
- Templates personalizados
- Controle de envios

### Templates Disponíveis
1. **Protocolo de Solicitação**
   - Número do protocolo
   - Dados do solicitante
   - Instruções de consulta
   - Alerta sobre SPAM

2. **Atualização de Status**
   - Status atual
   - Histórico de movimentações
   - Próximos passos

3. **Comunicados ao Atendente**
   - Nova solicitação
   - Documentos pendentes
   - Prazos de análise

## Integrações
- **Planilha API**: Log de envios
- **Módulo Cidadão**: Envio de protocolos
- **Módulo Atendimento**: Notificações de status

## Configurações de E-mail
- **Remetente**: [Email do Sistema]
- **Nome de Exibição**: SEFAZ/PA - Dívida Ativa
- **Cópia Oculta**: [Email de Controle]
- **Bounce Handler**: Configurado

## Deploy
```bash
# Deploy via clasp
clasp push
clasp deploy --deploymentId AKfycbzVUDExZbAyLYVQ-8CAbAg3JjKA3cQ1NVv60P3-c9F2HC8Gtvkr4wb1uxjgrf65NZF7 --description "Deploy Produção - Email"
```

## Ambiente
- **URL**: [URL do Sistema em Produção]
- **Planilha**: [Link da Planilha de Produção]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: AKfycbzVUDExZbAyLYVQ-8CAbAg3JjKA3cQ1NVv60P3-c9F2HC8Gtvkr4wb1uxjgrf65NZF7

## ⚠️ Importante
Este é o ambiente de **PRODUÇÃO**. Todas as alterações aqui afetam diretamente os usuários finais. Sempre teste as mudanças em Homologação primeiro.
