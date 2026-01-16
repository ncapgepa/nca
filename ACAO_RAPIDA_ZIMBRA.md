# ⚡ AÇÕES IMEDIATAS - Erro de Autenticação Zimbra

**Data:** 16 de janeiro de 2026  
**Problema:** Falha na autenticação com Zimbra  
**Solução:** 3 passos rápidos

---

## 🎯 PASSO 1: Verificar Script Properties (2 minutos)

Abra: https://script.google.com → Seu projeto → ⚙️ Configurações → Script Properties

Copie EXATAMENTE (sem espaços):

```
ZIMBRA_URL = https://mail.pa.gov.br/service/soap
ZIMBRA_USER = seu_usuario
ZIMBRA_PASS = sua_senha
USE_ZIMBRA = true
```

⚠️ **Crítico:**
- `ZIMBRA_USER`: Usar EXATAMENTE como aparece no webmail do Zimbra
- `ZIMBRA_PASS`: Sem espaços antes/depois, sem caracteres invisíveis
- Copiar/colar com cuidado (às vezes copia espaços extras)

---

## 🧪 PASSO 2: Testar Autenticação (5 minutos)

### Opção A: Teste Rápido no Console

1. Abrir Google Apps Script Editor
2. Ir para **Execuções** (lado esquerdo)
3. Clicar em **+ Nova execução**
4. Selecionar função **`getZimbraAuthToken`**
5. Clicar ▶️ **Executar**
6. Ver resultado nos logs

**Se aparecer algo assim = ✅ OK:**
```
✅ Autenticação Zimbra realizada com sucesso
```

**Se aparecer algo assim = ❌ Erro:**
```
Erro na autenticação Zimbra: HTTP 401
```

### Opção B: Diagnóstico Completo (mais detalhado)

1. Copiar a função `diagnosticoZimbra()` de `DIAGNOSTICO_ZIMBRA.md`
2. Cola no seu `Codigo.js` (temporariamente)
3. Fazer push: `clasp push`
4. Executar `diagnosticoZimbra()` no console (Execuções)
5. Ver logs detalhados com informações sobre a conexão

---

## 🔧 PASSO 3: Solucionar Conforme o Erro

### Erro: HTTP 401 (Credenciais)

**Causa:** Usuário ou senha incorretos

**Solução:**
```
1. Testar login manualmente: https://mail.pa.gov.br
   (Use o MESMO usuário/senha que está no Script Properties)
   
2. Se funcionar no webmail:
   - Copiar/colar novamente no Script Properties
   - Cuidado com espaços em branco
   
3. Se não funcionar no webmail:
   - Sua senha está errada
   - Conta foi bloqueada
   - Solicitar reset de senha ao admin
```

---

### Erro: HTTP 404 (URL não encontrada)

**Causa:** URL do servidor SOAP está errada

**Solução:**
```
Testar estas URLs (uma delas deve funcionar):
- https://mail.pa.gov.br/service/soap ← Tente esta primeiro
- https://webmail.pa.gov.br/service/soap
- https://mail.pa.gov.br:7071/service/soap
- https://OUTRO_DOMINIO/service/soap

Solicitar ao admin a URL exata do SOAP Zimbra
```

---

### Erro: HTTP 500 (Servidor com erro)

**Causa:** Servidor Zimbra está com problema

**Solução:**
```
- Tentar novamente em 5 minutos
- Se persistir, solicitar ao admin para verificar saúde do Zimbra
- Usar fallback Google Mail enquanto isso:
  USE_ZIMBRA = false
```

---

### Erro: Timeout (Rede)

**Causa:** Não consegue conectar ao servidor

**Solução:**
```
- Testar ping do servidor:
  ping mail.pa.gov.br
  
- Testar DNS:
  nslookup mail.pa.gov.br
  
- Se falhar:
  - Problema de rede/firewall
  - Solicitar ao admin para liberar IP Google Apps Script
```

---

## 📝 Checklist Rápido

- [ ] `ZIMBRA_URL` preenchida: `https://mail.pa.gov.br/service/soap`
- [ ] `ZIMBRA_USER` preenchida: seu usuário
- [ ] `ZIMBRA_PASS` preenchida: sua senha
- [ ] `USE_ZIMBRA` = `true`
- [ ] Sem espaços em branco antes/depois
- [ ] Testar `getZimbraAuthToken()` no console
- [ ] Se OK → remover função de diagnóstico
- [ ] Se erro → identificar tipo (401, 404, 500, timeout)

---

## 🚀 Se Tudo Estiver OK

Remover a função `diagnosticoZimbra()` que adicionou:

```bash
# 1. Editar Codigo.js e remover a função diagnosticoZimbra
# 2. Fazer push
clasp push

# 3. Testar envio de email (adicionar na fila de EmailQueue)
# 4. Abrir URL publicada do Apps Script
```

---

## 📞 Se Nada Funcionar

Compartilhe comigo:
1. **Resultado de `diagnosticoZimbra()`** (todos os logs)
2. **URL do seu servidor Zimbra** (https://mail.pa.gov.br ou outro)
3. **Formato do usuário que usa no webmail** (joao@pa.gov.br ou joao ou outro)
4. **Se consegue fazer login no webmail** (sim/não)

---

**Tempo total:** ~10 minutos para resolver

