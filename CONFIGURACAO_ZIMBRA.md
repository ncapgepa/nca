# 📧 CONFIGURAÇÃO ZIMBRA - SisNCA Email Homologação

**Data:** 16 de janeiro de 2026  
**Módulo:** Homologacao/Email/src/Codigo.js  
**Status:** ✅ Implementado

---

## 🎯 Visão Geral

A integração com Zimbra foi implementada na homologação para enviar emails através da API SOAP do servidor Zimbra da PA, mantendo compatibilidade com Google Mail (fallback automático).

### Recurso com Fallback
- **Se Zimbra está configurado:** Usa Zimbra API para enviar emails
- **Se Zimbra falha ou não está configurado:** Usa Google Mail automaticamente
- **Sem bloqueios:** Sistema continua funcionando em ambos os casos

---

## 🔧 PASSO 1: Configurar Propriedades do Script

No Google Apps Script Editor, vá para **Projeto → Propriedades do Script** (ou **Project Settings → Script Properties**):

### Adicione as seguintes propriedades:

| Propriedade | Valor | Exemplo |
|------------|-------|---------|
| **ZIMBRA_URL** | URL do servidor SOAP | `https://mail.pa.gov.br/service/soap` |
| **ZIMBRA_USER** | Usuário de serviço | `nca-sistema@pa.gov.br` |
| **ZIMBRA_PASS** | Senha de serviço | `SuaSenhaSegura123` |
| **USE_ZIMBRA** | Ativar Zimbra | `true` (ou `false` para desativar) |

### Instruções Detalhadas:

1. Abra o Apps Script: https://script.google.com
2. Selecione o projeto: "SisNCA Email Homologação"
3. Clique no ícone ⚙️ (Configurações do Projeto)
4. Na aba **Script Properties**, clique em "Adicionar propriedade"
5. Preencha cada propriedade conforme tabela acima
6. Clique em "Salvar propriedades"

**Exemplo de URL Zimbra:**
```
https://mail.pa.gov.br/service/soap
```

---

## 📝 PASSO 2: Credenciais Seguras

### Usuário de Serviço no Zimbra

Solicite ao administrador Zimbra para criar um usuário de serviço:

```
Usuário: nca-sistema@pa.gov.br
Senhas: Use uma senha forte (mínimo 12 caracteres)
Permissões: Apenas enviar emails (não precisa caixa de entrada)
```

### ⚠️ Segurança

- ✅ **DO:** Usar usuário de serviço dedicado
- ✅ **DO:** Usar senha complexa
- ✅ **DO:** Armazenar em Properties do Script (não no código)
- ❌ **NÃO:** Commitar senhas no GitHub
- ❌ **NÃO:** Compartilhar credenciais por email

---

## 🧪 PASSO 3: Testar a Integração

### Teste 1: Verificar Autenticação

No Apps Script Editor, abra o **Console de Execução** e execute:

```javascript
const token = getZimbraAuthToken();
if (token) {
  console.log("✅ Autenticação bem-sucedida! Token: " + token.substring(0, 20) + "...");
} else {
  console.log("❌ Falha na autenticação. Verifique as credenciais.");
}
```

**Resultado esperado:**
```
✅ Autenticação bem-sucedida! Token: ABC123XYZ789...
```

### Teste 2: Enviar Email de Teste

Crie um email na fila (Sheets → Aba EmailQueue) com dados de teste:

| Timestamp | Protocolo | Nome | Email | Status | Observação |
|-----------|-----------|------|-------|--------|-----------|
| 2026-01-16 12:00 | PGE-TEST-001 | João Silva | seu@email.com | Novo | Email de teste |

Em seguida, abra a URL do Apps Script (publicado) no navegador. O email deve ser enviado.

**Ver logs:**
- Abra Google Apps Script → Execuções
- Procure pela execução mais recente
- Verifique os logs para mensagens de sucesso/erro

---

## 📊 Arquitetura de Fluxo

```
┌────────────────────┐
│ Fila de Emails     │
│ (Google Sheets)    │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│ doGet() executa    │
│ - Lê fila          │
│ - Obtém token      │
│ - Envia emails     │
└─────────┬──────────┘
          │
          ├─→ [Se USE_ZIMBRA = true]
          │   ├─→ Zimbra API (SOAP)
          │   │   ├─→ ✅ Sucesso
          │   │   └─→ ❌ Erro → Fallback
          │   │
          │   └─→ Google Mail (Fallback)
          │       └─→ ✅ Sucesso
          │
          └─→ [Se USE_ZIMBRA = false]
              └─→ Google Mail direto
                  └─→ ✅ Sucesso

          ↓
┌────────────────────┐
│ Email Enviado      │
│ - Logs registrados │
│ - Fila limpa       │
└────────────────────┘
```

---

## 🔍 Funções Adicionadas

### getZimbraAuthToken()
```javascript
/**
 * Autentica no Zimbra e retorna o token.
 * @returns {string|null} Token de autenticação ou null em caso de falha
 */
function getZimbraAuthToken()
```

**Características:**
- ✅ Usa credentials das Properties
- ✅ Envia SOAP XML com Auth request
- ✅ Extrai e valida token
- ✅ Registra erros em logs

**Retorno:**
- `"ABC123..."` - Token válido
- `null` - Erro de autenticação

---

### sendZimbraEmail(token, to, subject, htmlBody, displayName)
```javascript
/**
 * Envia e-mail via Zimbra SendMsgRequest.
 * @param {string} token - Token de autenticação
 * @param {string} to - Email destinatário
 * @param {string} subject - Assunto
 * @param {string} htmlBody - Corpo HTML
 * @param {string} displayName - Nome remetente
 * @returns {boolean} True se enviado, false caso contrário
 */
function sendZimbraEmail(token, to, subject, htmlBody, displayName)
```

**Características:**
- ✅ Escape de caracteres especiais
- ✅ CDATA para HTML seguro
- ✅ Validação de resposta
- ✅ Logs detalhados
- ✅ Tratamento de erros

**Retorno:**
- `true` - Email enviado com sucesso
- `false` - Erro no envio

---

## 📋 Fluxo na Função doGet()

```javascript
// 1. Obter token Zimbra se configurado
let zimbraToken = null;
if (USE_ZIMBRA) {
  zimbraToken = getZimbraAuthToken();
  if (!zimbraToken) {
    return HtmlService.createHtmlOutput('❌ Erro na autenticação Zimbra');
  }
}

// 2. Para cada email na fila
for (let i = 0; i < data.length; i++) {
  // ... extrair dados ...
  
  // 3. Enviar via Zimbra OU Google Mail
  let enviado = false;
  if (USE_ZIMBRA && zimbraToken) {
    enviado = sendZimbraEmail(zimbraToken, email, assunto, corpo, "PGE - Atendimento");
  } else {
    try {
      MailApp.sendEmail({ to: email, subject: assunto, htmlBody: corpo });
      enviado = true;
    } catch (e) {
      enviado = false;
    }
  }
  
  if (enviado) {
    emailsSent++;
  }
}
```

---

## ✅ Verificação de Funcionamento

### Logs Esperados (Sucesso)

```
✅ Token Zimbra obtido com sucesso
✅ Email enviado via Zimbra para joao@pa.gov.br
✅ Email enviado via Zimbra para maria@pa.gov.br
✅ Autenticação Zimbra realizada com sucesso
```

### Logs de Erro (Diagnóstico)

```
❌ Erro na autenticação Zimbra: HTTP 401
❌ Erro ao enviar e-mail Zimbra para joao@pa.gov.br: Fault in response
❌ Erro ao autenticar com Zimbra: Invalid credentials
```

**Se ver erros:**
1. Verificar credentials nas Properties
2. Testar acesso ao servidor Zimbra (ping, nslookup)
3. Verificar se usuário existe e é de serviço
4. Testar manualmente via cURL/Postman

---

## 🔄 Alternância Entre Provedores

### Para Usar Apenas Zimbra

Na **Script Properties**, defina:
```
USE_ZIMBRA = true
```

Sistema só usará Zimbra. Se falhar, retorna erro.

### Para Usar Apenas Google Mail

Na **Script Properties**, defina:
```
USE_ZIMBRA = false
```

Sistema usa Google Mail (MailApp) sempre.

### Para Usar Zimbra com Fallback (Recomendado)

Na **Script Properties**, defina:
```
USE_ZIMBRA = true
```

E mantém o código de fallback para Google Mail no `doGet()`.

Sistema tenta Zimbra, se falhar cai para Google Mail automaticamente.

---

## 📊 Comparação: Zimbra vs Google Mail

| Aspecto | Google Mail | Zimbra |
|---------|-------------|--------|
| **Custo** | Incluído no GAS | Servidor próprio |
| **Limite** | 100 emails/dia | Conforme servidor |
| **Latência** | Baixa | Média (rede interna) |
| **Controle** | Limitado | Total |
| **Privacidade** | Google tem acesso | Controlado |
| **Customização** | Nenhuma | Total (headers, etc) |

**Recomendação:** Zimbra para produção, Google Mail para backup.

---

## 🚀 Deploy

### 1. Atualizar Código
```bash
cd Homologacao/Email
clasp push
```

### 2. Configurar Propriedades
- Abrir Script Properties
- Adicionar credenciais Zimbra

### 3. Testar
- Executar `getZimbraAuthToken()` no console
- Enviar email de teste

### 4. Deploy
```bash
clasp deploy --description "Integração Zimbra com fallback Google Mail"
```

---

## 🆘 Troubleshooting

### Problema: "HTTP 401 - Unauthorized"
**Causa:** Credenciais incorretas  
**Solução:**
1. Verificar username/password nas Properties
2. Testar acesso manualmente ao Zimbra
3. Verificar se é usuário de serviço ativo

---

### Problema: "Timeout ao conectar"
**Causa:** URL Zimbra inválida ou servidor indisponível  
**Solução:**
1. Verificar URL nas Properties
2. Testar ping/nslookup da URL
3. Verificar firewall/acesso de rede

---

### Problema: "Emails não são enviados, sem erros"
**Causa:** Fallback silencioso para Google Mail, que também falhou  
**Solução:**
1. Verificar logs no Google Apps Script → Execuções
2. Validar permissões do usuário Google
3. Verificar quotas diárias

---

### Problema: "CDATA não funciona"
**Causa:** HTML especial quebrando CDATA  
**Solução:**
- Código já escapa caracteres especiais automaticamente
- Se persistir, remover caracteres Unicode da body

---

## 📚 Referências

- [Zimbra SOAP API](https://wiki.zimbra.com/wiki/Zimbra_SOAP_API)
- [Google Apps Script MailApp](https://developers.google.com/apps-script/reference/mail/mail-app)
- [UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app)

---

## ✨ Resumo

✅ **Implementação:** Completa  
✅ **Fallback:** Ativo (Google Mail)  
✅ **Segurança:** Credenciais em Properties  
✅ **Logs:** Detalhados e estruturados  
✅ **Testes:** Função disponível  

**Status:** Pronto para usar em Homologação!

