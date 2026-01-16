# 🔐 Configuração Zimbra - Usuário Padrão (Qualquer Usuário)

**Data:** 16 de janeiro de 2026  
**Status:** ✅ Funciona com QUALQUER usuário + senha

---

## ✅ Tipos de Usuários Suportados

O código agora funciona com:

### 1. **Usuário Padrão** (Mais Comum)
```
Usuário: joao.silva@pa.gov.br
Senha: SuaSenha123
```
✅ Seu próprio usuário Zimbra com sua senha pessoal

### 2. **Usuário de Serviço** (Dedicado)
```
Usuário: nca-sistema@pa.gov.br
Senha: SenhaDoServico456
```
✅ Usuário criado especificamente para o sistema

### 3. **Qualquer Outro Usuário Válido**
```
Usuário: maria.santos@pa.gov.br
Senha: SuaSenha789
```
✅ Desde que tenha permissão de envio de emails

---

## 🔧 CONFIGURAÇÃO RÁPIDA (Usuário Padrão)

### Passo 1: Identificar seu usuário Zimbra

**Qual é seu email institucional?**
```
Ex: joao.silva@pa.gov.br
    maria.santos@pa.gov.br
    seu.nome@pa.gov.br
```

Este é seu `ZIMBRA_USER`.

### Passo 2: Obter sua senha

Use a mesma senha que você usa para acessar o webmail Zimbra.

### Passo 3: Configurar no Google Apps Script

Abra: https://script.google.com

1. Selecione o projeto: "SisNCA Email Homologação"
2. Clique ⚙️ (Projeto → Propriedades do Script)
3. Na aba **Script Properties**, adicione:

| Propriedade | Valor |
|------------|-------|
| **ZIMBRA_URL** | `https://mail.pa.gov.br/service/soap` |
| **ZIMBRA_USER** | `joao.silva@pa.gov.br` |
| **ZIMBRA_PASS** | `SuaSenha123` |
| **USE_ZIMBRA** | `true` |

**Clique em "Salvar propriedades"**

### Passo 4: Testar Autenticação

No Apps Script Editor:

1. Abra **Execução → Nova Execução** (ou Execute)
2. Selecione função: `getZimbraAuthToken`
3. Clique em "Executar"
4. Verifique os logs (Execuções → Clique na execução)

**Esperado:**
```
✅ Autenticação Zimbra realizada com sucesso para: joao.silva@pa.gov.br
```

**Se falhar:**
```
❌ Falha de autenticação: Usuário ou senha incorretos
```

---

## 📝 Exemplos de Configuração

### Exemplo 1: João Silva (Usuário Padrão)
```
ZIMBRA_USER = joao.silva@pa.gov.br
ZIMBRA_PASS = MinhaSenha123
USE_ZIMBRA = true
```

### Exemplo 2: Usuário de Serviço
```
ZIMBRA_USER = nca-sistema@pa.gov.br
ZIMBRA_PASS = SenhaDoServico456
USE_ZIMBRA = true
```

### Exemplo 3: Sistema com Fallback
```
ZIMBRA_USER = maria@pa.gov.br
ZIMBRA_PASS = SuaSenha789
USE_ZIMBRA = true
# Se Zimbra falhar, usa Google Mail automaticamente
```

---

## 🎯 Fluxo de Envio

```
┌─────────────────────────────────────────────┐
│ Fila de Emails (Google Sheets)              │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│ doGet() executa                             │
│ 1. Obtém token Zimbra com seu usuário      │
│ 2. Autentica com joao.silva@pa.gov.br      │
│ 3. Recebe token válido                      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│ Envia emails via Zimbra SOAP                │
│ Cada email enviado como joao.silva          │
│ (ou o usuário configurado)                  │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│ ✅ Emails entregues com sucesso             │
│ Remetente: joao.silva@pa.gov.br             │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementação

- [ ] **Passo 1:** Identificar seu email Zimbra (joao.silva@pa.gov.br)
- [ ] **Passo 2:** Ter a senha disponível
- [ ] **Passo 3:** Configurar 4 propriedades no Script
- [ ] **Passo 4:** Testar com `getZimbraAuthToken()`
- [ ] **Passo 5:** Fazer `clasp push`
- [ ] **Passo 6:** Testar envio de email

---

## 🧪 Teste Rápido

### 1. Executar Função de Autenticação

Console do Apps Script:
```javascript
getZimbraAuthToken()
```

### 2. Verificar Logs

Vá para **Execuções** e procure pela última execução.

**Logs de Sucesso:**
```
✅ Autenticação Zimbra realizada com sucesso para: joao.silva@pa.gov.br
```

**Logs de Erro (Diagnosticar):**
```
❌ Falha de autenticação: Usuário ou senha incorretos
→ Verifique ZIMBRA_USER e ZIMBRA_PASS
→ Teste suas credenciais no webmail Zimbra

❌ Erro na autenticação Zimbra: HTTP 500
→ Servidor Zimbra com problema
→ Tente novamente depois

❌ Erro ao autenticar com Zimbra: ECONNREFUSED
→ URL Zimbra incorreta ou servidor indisponível
→ Verifique ZIMBRA_URL
```

---

## 🚀 Deploy

### 1. Fazer Push
```bash
cd Homologacao/Email
clasp push
```

### 2. Deploy
```bash
clasp deploy --description "Zimbra com usuário padrão"
```

### 3. Usar
- Abrir URL do Apps Script publicado
- Emails da fila serão enviados via seu usuário Zimbra

---

## 💡 Diferenças: Usuário Padrão vs Serviço

| Aspecto | Usuário Padrão | Usuário Serviço |
|---------|---|---|
| **Criação** | Já existe | Criar no Zimbra |
| **Senha** | Sua senha pessoal | Senha específica |
| **Permissões** | Automáticas | Pode precisar ajustar |
| **Emails enviados como** | Seu nome | Nome do serviço |
| **Caixa de entrada** | Recebe emails | Pode estar vazia |
| **Segurança** | Menos isolado | Mais isolado |
| **Complexidade** | Simples ✅ | Média |

**Recomendação:** Se for teste/dev → Usuário padrão. Se for produção → Usuário serviço.

---

## 🔒 Segurança da Senha

✅ **BOM:** Armazenar em Script Properties (criptografado pelo Google)  
❌ **RUIM:** Deixar a senha visível no código  
❌ **RUIM:** Compartilhar a senha por email  

**O código atual:**
```javascript
const ZIMBRA_USER = PropertiesService.getScriptProperties().getProperty('ZIMBRA_USER');
const ZIMBRA_PASS = PropertiesService.getScriptProperties().getProperty('ZIMBRA_PASS');
```

✅ Seguro! Não aparece no código-fonte.

---

## 🆘 Troubleshooting

### "Falha de autenticação: Usuário ou senha incorretos"

**Causas possíveis:**
1. Usuário digitado errado (verific maiúsculas/minúsculas)
2. Senha incorreta ou expirada
3. Usuário não tem permissão de envio

**Solução:**
1. Teste suas credenciais no webmail: https://mail.pa.gov.br
2. Confirme que consegue acessar
3. Se tiver problema, contate Admin Zimbra

---

### "HTTP 500 - Erro interno do servidor"

**Causa:** Servidor Zimbra com problema

**Solução:**
1. Esperar alguns minutos
2. Tentar novamente
3. Contatar Admin Zimbra

---

### "ECONNREFUSED ou timeout"

**Causa:** URL Zimbra incorreta ou indisponível

**Solução:**
```
1. Verificar ZIMBRA_URL
2. Testar ping: ping mail.pa.gov.br
3. Testar com Postman a URL SOAP
```

---

## 📚 Documentação Completa

Para detalhes técnicos, veja: **CONFIGURACAO_ZIMBRA.md**

---

## ✨ Resumo

✅ Funciona com qualquer usuário Zimbra  
✅ Apenas 4 properties para configurar  
✅ Teste rápido via console  
✅ Fallback automático para Google Mail  
✅ Fácil de implementar  

**Pronto para usar!**

