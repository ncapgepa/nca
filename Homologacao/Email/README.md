# Módulo Email - Homologação

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
clasp deploy --deploymentId <ID_DEPLOY> --description "Deploy Homologação - Email"
```

## Ambiente
- **URL**: [URL do Sistema em Homologação]
- **Planilha**: [Link da Planilha de Homologação]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: [ID de Deploy]

## Testes
1. Envio de protocolos
2. Notificações de status
3. Verificação de SPAM
4. Bounce handling
5. Templates
