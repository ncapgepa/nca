# 🎯 RESUMO: Resolvendo o Erro de Autenticação Zimbra

**Seu erro:**
```
❌ Falha na autenticação com o servidor Zimbra. 
   Verifique as credenciais nas propriedades do script.
```

**Status:** 3 causas prováveis → Siga os passos abaixo

---

## 🔍 O que Pode Estar Errado

| # | Problema | Solução | Tempo |
|---|----------|---------|-------|
| 1 | **Credenciais nas Properties estão erradas** | Copiar/colar novamente com cuidado | 2 min |
| 2 | **URL do Zimbra é diferente** | Solicitar URL exata ao admin | 5 min |
| 3 | **Usuário/Senha realmente incorretos** | Testar login no webmail Zimbra | 3 min |

---

## ⚡ AÇÕES IMEDIATAS (Comece por aqui!)

### Opção A: Teste Rápido (5 minutos)

```bash
1. Abrir: https://script.google.com
2. Seu projeto → Execuções (lado esquerdo)
3. Clicar em "+ Nova execução"
4. Selecionar: getZimbraAuthToken
5. Clicar: ▶️ Executar
```

**Resultado esperado:**
```
✅ Autenticação Zimbra realizada com sucesso
```

**Se der erro:**
```
❌ Erro na autenticação Zimbra: HTTP 401/404/500
```

---

### Opção B: Diagnóstico Completo (10 minutos)

Se o teste rápido não funcionar:

1. **Copiar a função `diagnosticoZimbra()`**
   - De: `DIAGNOSTICO_ZIMBRA.md` no GitHub
   - Para: Seu `Homologacao/Email/src/Codigo.js`

2. **Fazer push:**
   ```bash
   clasp push
   ```

3. **Executar diagnóstico:**
   - Google Apps Script → Execuções
   - Nova execução → `diagnosticoZimbra`
   - Clicar ▶️

4. **Ver logs detalhados:**
   - Clique na execução
   - Veja os logs (mostram exatamente o que está errado)

---

## 🔧 Checklist - Verificar Estas Coisas

- [ ] **ZIMBRA_URL** = `https://mail.pa.gov.br/service/soap` ✓
  - Sem `http://` (deve ser `https://`)
  - Sem `/` no final
  - Com `/service/soap`

- [ ] **ZIMBRA_USER** = seu usuário ✓
  - Mesmo formato que usa para fazer login no webmail Zimbra
  - Pode ser `joao@pa.gov.br` OU `joao` (depende do servidor)
  - **NEM UMA COISA NEM OUTRA MISTURADA**

- [ ] **ZIMBRA_PASS** = sua senha ✓
  - Sem espaços antes/depois
  - Case-sensitive (maiúscula/minúscula importa)
  - Cuidado ao copiar/colar (às vezes copia caracteres invisíveis)

- [ ] **USE_ZIMBRA** = `true` ✓

---

## 📋 Próximas Ações

### Se o Teste Rápido Funcionar (✅)

```
1. Remover função diagnosticoZimbra() do código
2. Fazer push: clasp push
3. Testar envio real de email
4. Pronto!
```

### Se der Erro HTTP 401

```
❌ Credenciais incorretas

→ Testar login no webmail:
  1. Abrir https://mail.pa.gov.br
  2. Usar MESMO usuário/senha das Properties
  3. Se funcionar manualmente = credenciais estão OK, problema é outro
  4. Se não funcionar = credenciais estão erradas
```

### Se der Erro HTTP 404

```
❌ URL não encontrada

→ Solicitar ao admin a URL exata do SOAP Zimbra
  - Pode ser diferente de https://mail.pa.gov.br/service/soap
  - Pode ter porto diferente, domínio diferente, etc
```

### Se der Timeout

```
❌ Não consegue conectar

→ Testar conexão:
  ping mail.pa.gov.br
  
  Se falhar = problema de rede/firewall
  Solicitar ao admin para liberar acesso
```

---

## 📞 Se Precisar de Ajuda

Compartilhe comigo:

1. **Saída do `diagnosticoZimbra()`** (copie os logs)
2. **URL do seu servidor Zimbra** (pode ser diferente de `https://mail.pa.gov.br`)
3. **Formato do usuário** (você usa `joao`, `joao@pa.gov.br`, ou outra coisa?)
4. **Se consegue logar no webmail Zimbra** (sim/não)

Com essas informações consigo resolver em 5 minutos.

---

## 📚 Documentação Disponível

- `ACAO_RAPIDA_ZIMBRA.md` - 3 passos rápidos
- `DIAGNOSTICO_ZIMBRA.md` - Guia completo com função de teste
- `CONFIGURACAO_ZIMBRA.md` - Setup detalhado
- `RESUMO_ZIMBRA.md` - Overview da implementação

---

**Status:** 🔄 Aguardando seu teste  
**Tempo para resolver:** ~10 minutos

