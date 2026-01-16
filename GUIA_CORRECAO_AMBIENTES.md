# 🔧 GUIA DE CORREÇÃO: Desacoplando Ambientes

**Objetivo:** Separar completamente os ambientes de Homologação e Produção  
**Tempo Estimado:** 45-60 minutos  
**Perigo:** CRÍTICO - Erros nesta etapa afetam produção  

---

## ⚠️ PRÉ-REQUISITOS

Antes de começar, você precisará de:

- [ ] Acesso a Google Cloud Console (conta de Produção)
- [ ] Acesso a Google Apps Script
- [ ] Git configurado com SSH ou HTTPS
- [ ] Clasp instalado: `npm install -g @google/clasp`
- [ ] Clasp logado: `clasp login`

---

## PASSO 1: COPIAR FUNÇÃO FALTANTE EM ATENDIMENTO

### Problema
Produção não tem `getRequestsPaginated()` que está em Homologação.

### Solução

1. Abrir arquivo: `Homologacao/Atendimento/src/Code.js`
2. Localizar a função `getRequestsPaginated()` (linhas ~74-160)
3. Copiar todo o conteúdo da função:

```javascript
/**
 * Retorna pedidos paginados para o painel.
 * @param {number} page - Número da página (começando em 1)
 * @param {number} pageSize - Número de itens por página
 * @param {string} searchTerm - Termo de busca (opcional)
 * @param {string} statusFilter - Filtro de status (opcional)
 * @param {string} sortBy - Campo para ordenação (opcional)
 * @param {string} sortOrder - Ordem de classificação: 'asc' ou 'desc' (opcional)
 */
function getRequestsPaginated(page = 1, pageSize = 20, searchTerm = '', statusFilter = '', sortBy = 'data', sortOrder = 'desc') {
  // ... TODO: COPIAR CONTEÚDO COMPLETO
}
```

4. Abrir arquivo: `Producao/Atendimento/src/Code.js`
5. Localizar função `getRequests()` (linha ~63)
6. **APÓS** a função `getRequests()`, inserir a função `getRequestsPaginated()`
7. Salvar arquivo

**Checkpoint:**
```bash
# Verificar que está correto
wc -l Producao/Atendimento/src/Code.js
# Deve ter AUMENTADO ~100 linhas
```

---

## PASSO 2: CRIAR NOVO APPS SCRIPT PARA ATENDIMENTO PRODUÇÃO

### 2.1 Criar Script no Google Cloud

```
1. Ir para: https://script.google.com
2. Clicar em "+ Novo Projeto"
3. Nomear: "SisNCA Atendimento Produção"
4. Fechar o editor (vamos usar clasp)
5. Copiar o Project ID da URL:
   https://script.google.com/d/{PROJECT_ID}/edit
```

### 2.2 Obter o Script ID

```bash
# No terminal, na pasta Producao/Atendimento:
clasp create --title "SisNCA Atendimento Produção" --type standalone

# Isso vai:
# 1. Criar novo Apps Script
# 2. Atualizar .clasp.json automaticamente
# 3. Mostrar o novo scriptId
```

**Copiar o scriptId exibido na tela.**

### 2.3 Atualizar .clasp.json (Manual - se clasp create não funcionar)

Se `clasp create` não funcionou, edite manualmente:

**Arquivo:** `Producao/Atendimento/.clasp.json`

```json
{
  "scriptId": "NOVO_SCRIPT_ID_AQUI",
  "rootDir": "src",
  "scriptExtensions": [".js", ".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"],
  "filePushOrder": [],
  "skipSubdirectories": false
}
```

---

## PASSO 3: FAZER PUSH DO CÓDIGO PARA NOVO SCRIPT

```bash
# Na pasta Producao/Atendimento:
cd Producao/Atendimento

# Fazer push do código
clasp push

# Confirmar que quer sobrescrever (SIM)
```

### Validação

```bash
# Verificar arquivos no script
clasp status

# Deve mostrar:
# Arquivos do projeto local
# └─ src/Code.js
# └─ src/painel.html
# └─ src/sistema.html
# └─ src/appsscript.json
```

---

## PASSO 4: FAZER DEPLOY DO NOVO SCRIPT ATENDIMENTO

```bash
# Na pasta Producao/Atendimento:

# Obter versão atual
clasp versions

# Criar nova versão (substitua N pelo próximo número)
clasp deploy --description "Produção Atendimento - Deploy N"

# Copiar o DEPLOYMENT_ID exibido
```

**Novo Deployment ID para Atendimento Produção:**
```
[ANOTAR AQUI]
```

---

## PASSO 5: CRIAR NOVO APPS SCRIPT PARA EMAIL PRODUÇÃO

Repetir os passos 2-4 para Email:

```bash
# Na pasta Producao/Email:
cd Producao/Email

# Opção 1: Criar automaticamente
clasp create --title "SisNCA Email Produção" --type standalone

# Opção 2: Atualizar .clasp.json manualmente com novo scriptId
```

**Anotar novo scriptId e deployment ID para Email.**

---

## PASSO 6: CRIAR PLANILHA SEPARADA PARA EMAIL PRODUÇÃO

Atualmente, Homologação e Produção compartilham a mesma planilha. Precisamos separar:

### 6.1 Criar Planilha Novo para Produção

```
1. Ir para Google Sheets: https://sheets.google.com
2. Clicar em "+ Nova Planilha"
3. Nomear: "SisNCA Produção - Email Queue"
4. Criar uma aba chamada "EmailQueue"
5. Copiar o SHEET_ID da URL:
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

### 6.2 Atualizar Código Email Produção

**Arquivo:** `Producao/Email/src/Codigo.js`

Mudar:
```javascript
// ANTES
const SHEET_ID = '1k0ytrIaumadc4Dfp29i5KSdqG93RR2GXMMwBd96jXdQ';

// DEPOIS
const SHEET_ID = 'NOVO_SHEET_ID_AQUI';
```

---

## PASSO 7: FAZER PUSH E DEPLOY DO EMAIL PRODUÇÃO

```bash
# Na pasta Producao/Email:
clasp push

# Confirmar sobrescrita
```

Deploy:
```bash
clasp deploy --description "Produção Email - Deploy 1"

# Anotar novo deployment ID
```

---

## PASSO 8: ATUALIZAR REFERÊNCIAS (Importante!)

Se você tem arquivos HTML ou JavaScript que referenciam URLs de deploy, atualize-os:

### 8.1 Homologacao/Cidadao/src/Codigo.js

Já deveria estar correto:
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvKlMx5dx3aYjiwjk-NrD2ohJkIrpgG34hCdNmNtsoqfSFayuaDEIzT7Bi1hTm25Uclw/exec';
```

### 8.2 Producao/Cidadao/src/Codigo.js

Já deveria estar correto:
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvkce95ZEE84wqed5ltl1ZgkHyt4CGyPzMiq-zHJfXkHyL01X70xWU0Ot14scMd3sW/exec';
```

### 8.3 Producao/Atendimento/src/painel.html

Localizar referência a emailSenderUrl e verificar se está correto:
```javascript
// Dentro do template HTML
template.emailSenderUrl = emailSenderUrl;
```

Esta URL vem do Code.js, então já deveria estar OK.

---

## PASSO 9: TESTAR CADA AMBIENTE

### Teste 1: Homologacao/Atendimento

```bash
# Ir para a URL de homologação
# https://script.google.com/macros/s/{DEPLOYMENT_ID_HOMOLOG}/usercache

# Verificar:
# - Painel carrega
# - Tabela de protocolos aparece
# - Filtros funcionam
# - Paginação funciona (se houver 20+ protocolos)
# - Modal de detalhes abre
# - Edições não afetam produção
```

### Teste 2: Producao/Atendimento (NOVO)

```bash
# Ir para a URL de produção
# https://script.google.com/macros/s/{DEPLOYMENT_ID_PROD}/usercache

# Verificar:
# - Painel carrega (NOVO SCRIPT)
# - Tabela de protocolos aparece
# - Filtros funcionam
# - Paginação funciona (NOVA FUNÇÃO)
# - Modal de detalhes abre
# - Edições afetam apenas dados de produção
```

### Teste 3: Email Homologacao

```bash
# Adicionar um registro na fila de email de Homologação
# Via Google Sheets > Aba "EmailQueue"

# Disparar processEmailQueue()
# Verificar que email foi enviado

# Verificar: Dados vêm de planilha compartilhada (OK)
```

### Teste 4: Email Producao (NOVO)

```bash
# Adicionar um registro na fila de email de Produção
# Via Google Sheets > Aba "EmailQueue" > NOVA PLANILHA

# Disparar processEmailQueue()
# Verificar que email foi enviado

# Verificar: Dados vêm de NOVA planilha (OK)
```

---

## PASSO 10: GIT COMMIT E DOCUMENTAÇÃO

```bash
# Committar as mudanças
cd /caminho/para/SisNCA

git add .
git commit -m "Desacoplamento de ambientes: IDs de Apps Script únicos

- Atendimento Produção: novo scriptId
- Email Produção: novo scriptId e planilha
- Adicionado getRequestsPaginated() ao Atendimento Produção
- Ambientes agora completamente isolados"

git push origin main
```

---

## PASSO 11: DOCUMENTAR IDs

Criar arquivo `DEPLOYMENT_IDS.md`:

```markdown
# IDs de Deployment - SisNCA

## Homologação

### Atendimento
- Script ID: 1tdx4KziiwKpDJTVM6Zyt8kzt3b4KHJcoKDpWRqBMmr-lHp2eN-b_XPMy
- Deployment ID: [ANOTAR]
- URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercache

### Cidadão
- Script ID: 1ZTxAJtJSwCnOmqfVt6w-jnVcKr4bzTw_y5PiFMhEuzhoZZ-C7TVsRx0Q
- Deployment ID: [ANOTAR]
- URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercache

### Email
- Script ID: 1I5plZ-_jHEEFvJL5M7oAGyQq7jSNz3r8rpcFUKNRGWPiOHlKcd0mDtW4
- Deployment ID: [ANOTAR]
- Sheet ID: 1k0ytrIaumadc4Dfp29i5KSdqG93RR2GXMMwBd96jXdQ

## Produção

### Atendimento (NOVO)
- Script ID: [NOVO_ID_AQUI]
- Deployment ID: [ANOTAR]
- URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercache

### Cidadão
- Script ID: 1_A8ZY0GGeqxb_0P82iSemb5PtV5vS8o9sXk-AKS2Hap5SXlQvfrtFbB6
- Deployment ID: AKfycbxvkce95ZEE84wqed5ltl1ZgkHyt4CGyPzMiq-zHJfXkHyL01X70xWU0Ot14scMd3sW
- Sheet ID: 1Cnb-tqz1b5uvaW4rK3rlGjlYW3QJGEaz9sKPXCzEcxY

### Email (NOVO)
- Script ID: [NOVO_ID_AQUI]
- Deployment ID: [ANOTAR]
- URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercache
- Sheet ID: [NOVO_SHEET_ID_AQUI]
```

---

## CHECKLIST FINAL

- [ ] Função `getRequestsPaginated()` copiada para Produção/Atendimento
- [ ] Novo Script ID criado para Produção/Atendimento
- [ ] `.clasp.json` atualizado (Produção/Atendimento)
- [ ] Código feito push (Produção/Atendimento)
- [ ] Deploy realizado (Produção/Atendimento)
- [ ] Novo Script ID criado para Produção/Email
- [ ] `.clasp.json` atualizado (Produção/Email)
- [ ] Código feito push (Produção/Email)
- [ ] Nova planilha criada para Produção/Email
- [ ] `SHEET_ID` atualizado em Produção/Email
- [ ] Deploy realizado (Produção/Email)
- [ ] Todos os 4 ambientes testados
- [ ] IDs documentados em `DEPLOYMENT_IDS.md`
- [ ] Git commit realizado e push para main

---

## ⚠️ SE DER ERRO

### "scriptId já existe"
- [ ] Delete arquivo `.clasp.json` antes de fazer `clasp create`

### "Permissão negada"
- [ ] Verifique se está logado: `clasp login`
- [ ] Verifique se tem acesso ao Google Cloud Project

### "Classe ScriptApp não encontrada"
- [ ] Verifique que `appsscript.json` foi copiado
- [ ] Verifique `runtimeVersion` é "V8"

### "Email não foi enviado"
- [ ] Verifique `SHEET_ID` está correto
- [ ] Verifique que a aba `EmailQueue` existe
- [ ] Verifique permissões no Google Sheets

---

**Após completar:** Ir para `ANALISE_SISTEMA_PRODUCAO.md` para próximos passos de melhoria

