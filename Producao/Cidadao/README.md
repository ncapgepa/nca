# Módulo Cidadão - Produção

Interface pública para solicitações e consultas de prescrição de dívida ativa pelo contribuinte.

## Estrutura do Módulo
```
Cidadao/
├── src/
│   ├── Código.js      # Lógica de processamento
│   ├── cidadao.html   # Formulário de solicitação
│   ├── consulta.html  # Interface de consulta
│   └── appsscript.json # Configurações do projeto
└── Atualizacoes.txt   # Log de alterações
```

## Funcionalidades

### Formulário do Cidadão (`cidadao.html`)
- Preenchimento de dados pessoais
- Upload de documentos
- Validação de campos
- Confirmação via email
- Verificação de SPAM
- Indicador de carregamento

### Consulta de Processo (`consulta.html`)
- Busca por protocolo
- Visualização do status
- Histórico de movimentações
- Download de documentos

## Campos do Formulário
1. **Identificação**
   - Nome completo
   - CPF/CNPJ
   - E-mail
   - Telefone
   - Tipo de pessoa

2. **Documentação**
   - RG/CNH (Pessoa Física)
   - Contrato Social (Pessoa Jurídica)
   - Procuração (quando aplicável)

3. **CDAs**
   - Número da CDA
   - Validação do formato

## Integrações
- **Planilha API**: Registro de solicitações
- **Módulo Email**: Envio de protocolos
- **Módulo Atendimento**: Encaminhamento para análise

## Validações
- Formatação de CPF/CNPJ
- Formato de email
- Máscara de telefone
- Obrigatoriedade de documentos
- Formato de CDA

## Deploy
```bash
# Deploy via clasp
clasp push
clasp deploy --deploymentId AKfycbxvkce95ZEE84wqed5ltl1ZgkHyt4CGyPzMiq-zHJfXkHyL01X70xWU0Ot14scMd3sW --description "Deploy Produção - Cidadao"
```

## Ambiente
- **URL**: [URL do Sistema em Produção]
- **Planilha**: [Link da Planilha de Produção]
- **ID do Projeto**: [ID do Projeto no Google Apps Script]
- **ID de Deploy**: AKfycbxvkce95ZEE84wqed5ltl1ZgkHyt4CGyPzMiq-zHJfXkHyL01X70xWU0Ot14scMd3sW

## ⚠️ Importante
Este é o ambiente de **PRODUÇÃO**. Todas as alterações aqui afetam diretamente os usuários finais. Sempre teste as mudanças em Homologação primeiro.
