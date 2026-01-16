# 🔧 DIAGNÓSTICO ZIMBRA - Troubleshooting Autenticação

**Data:** 16 de janeiro de 2026  
**Problema:** Falha na autenticação com Zimbra  
**Status:** Resolvendo...

---

## ❌ Erro Recebido

```
Falha na autenticação com o servidor Zimbra. 
Verifique as credenciais nas propriedades do script.
```

---

## 🔍 PASSO 1: Verificar Credenciais nas Properties

Vá para **Projeto → Propriedades do Script** e confirme:

```
ZIMBRA_URL  = https://mail.pa.gov.br/service/soap
ZIMBRA_USER = seu_usuario@pa.gov.br  (⚠️ SEM @pa.gov.br se tiver domínio padrão)
ZIMBRA_PASS = sua_senha_correta
USE_ZIMBRA  = true
```

**⚠️ Pontos críticos:**

1. **Email do usuário:** Deve estar **EXATAMENTE** como aparece no Zimbra
   - Correto: `joao.silva@pa.gov.br` OU `joao.silva` (depende do servidor)
   - Incorreto: `joao silva` (espaço em branco)
   - Incorreto: `JOAO@PA.GOV.BR` (maiúsculas podem não funcionar)

2. **Senha:** Deve estar **EXATAMENTE** correta
   - Sem espaços antes/depois
   - Case-sensitive (maiúscula vs minúscula importa)
   - Sem caracteres especiais estranhos (copiar/colar pode copiar caracteres invisíveis)

3. **URL:** Deve ser a URL SOAP correta do seu servidor
   - Correto: `https://mail.pa.gov.br/service/soap`
   - Incorreto: `https://mail.pa.gov.br/` (sem /service/soap)
   - Incorreto: `http://` (deve ser HTTPS)

---

## 🧪 PASSO 2: Função de Diagnóstico

Adicione esta função ao seu `Codigo.js` temporariamente:

```javascript
/**
 * Função de diagnóstico para testar conexão Zimbra
 */
function diagnosticoZimbra() {
  const user = ZIMBRA_USER;
  const pass = ZIMBRA_PASS;
  const url = ZIMBRA_URL;
  
  Logger.log("═══════════════════════════════════════════");
  Logger.log("📊 DIAGNÓSTICO ZIMBRA");
  Logger.log("═══════════════════════════════════════════");
  Logger.log("URL: " + url);
  Logger.log("USER: " + user);
  Logger.log("PASS: " + (pass ? "***" + pass.substring(pass.length - 3) : "NÃO CONFIGURADA"));
  Logger.log("USE_ZIMBRA: " + PropertiesService.getScriptProperties().getProperty('USE_ZIMBRA'));
  Logger.log("═══════════════════════════════════════════");
  
  // Validar se credenciais estão preenchidas
  if (!user || !pass) {
    Logger.log("❌ ERRO: Credenciais não configuradas!");
    Logger.log("   - ZIMBRA_USER: " + (user ? "OK" : "VAZIO"));
    Logger.log("   - ZIMBRA_PASS: " + (pass ? "OK" : "VAZIO"));
    return;
  }
  
  // Tentar autenticar
  Logger.log("🔄 Tentando autenticar...");
  const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Body>
        <AuthRequest xmlns="urn:zimbraAccount">
          <account by="name">${user}</account>
          <password>${pass}</password>
        </AuthRequest>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const options = {
      method: 'post',
      contentType: 'application/soap+xml; charset=utf-8',
      payload: soapRequest,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log("HTTP Status: " + responseCode);
    Logger.log("Response length: " + responseText.length + " bytes");
    
    if (responseCode === 200) {
      Logger.log("✅ Resposta HTTP 200 (OK)");
      
      if (responseText.includes('<authToken>')) {
        Logger.log("✅ Token encontrado na resposta!");
        const tokenMatch = responseText.match(/<authToken>(.*?)<\/authToken>/);
        if (tokenMatch) {
          Logger.log("✅ Token extraído: " + tokenMatch[1].substring(0, 20) + "...");
          Logger.log("\n🎉 SUCESSO! Autenticação funcionando!");
        }
      } else if (responseText.includes('Fault')) {
        Logger.log("❌ SOAP Fault na resposta!");
        const faultMatch = responseText.match(/<faultstring>(.*?)<\/faultstring>/);
        if (faultMatch) {
          Logger.log("   Mensagem: " + faultMatch[1]);
        }
        Logger.log("\nResposta completa:");
        Logger.log(responseText);
      } else {
        Logger.log("⚠️ Resposta inesperada (não é SOAP válido)");
        Logger.log("Primeiros 500 chars:");
        Logger.log(responseText.substring(0, 500));
      }
    } else {
      Logger.log("❌ HTTP " + responseCode);
      Logger.log("Resposta:");
      Logger.log(responseText.substring(0, 500));
      
      if (responseCode === 401) {
        Logger.log("\n🔑 HTTP 401 = Credenciais incorretas ou servidor nega acesso");
      } else if (responseCode === 404) {
        Logger.log("\n📍 HTTP 404 = URL não encontrada. Verificar ZIMBRA_URL");
      } else if (responseCode === 500) {
        Logger.log("\n⚠️ HTTP 500 = Erro no servidor Zimbra");
      }
    }
  } catch (error) {
    Logger.log("❌ Exceção: " + error.message);
    Logger.log("Stack: " + error.stack);
  }
}
```

### Como usar:

1. **Copiar a função acima** para o arquivo `Homologacao/Email/src/Codigo.js`
2. **Fazer push:** `clasp push`
3. **Executar no console:** 
   - Abrir Google Apps Script
   - Clicar em **Execuções**
   - Procurar a função `diagnosticoZimbra`
   - Clicar no play ▶️
4. **Ver resultado nos logs:**
   - Na página de Execuções, clicar na execução
   - Ver logs detalhados

---

## 📋 O que os Logs Vão Revelar

### ✅ Se funcionar:
```
═══════════════════════════════════════════
📊 DIAGNÓSTICO ZIMBRA
═══════════════════════════════════════════
URL: https://mail.pa.gov.br/service/soap
USER: joao@pa.gov.br
PASS: ***345
USE_ZIMBRA: true
═══════════════════════════════════════════
🔄 Tentando autenticar...
HTTP Status: 200
Response length: 1234 bytes
✅ Resposta HTTP 200 (OK)
✅ Token encontrado na resposta!
✅ Token extraído: MjAxMzEwMjgxOzI3Lm...
🎉 SUCESSO! Autenticação funcionando!
```

### ❌ Se falhar - HTTP 401:
```
HTTP Status: 401
Response length: 456 bytes
❌ HTTP 401
🔑 HTTP 401 = Credenciais incorretas ou servidor nega acesso

→ SOLUÇÃO: Verificar ZIMBRA_USER e ZIMBRA_PASS
```

### ❌ Se falhar - HTTP 404:
```
HTTP Status: 404
Response length: 789 bytes
❌ HTTP 404
📍 HTTP 404 = URL não encontrada. Verificar ZIMBRA_URL

→ SOLUÇÃO: Verificar ZIMBRA_URL (deve ser https://mail.pa.gov.br/service/soap)
```

### ❌ Se falhar - Fault:
```
HTTP Status: 200
❌ SOAP Fault na resposta!
   Mensagem: authentication failed

→ SOLUÇÃO: Credenciais incorretas. Testar login manualmente no Zimbra Web
```

### ❌ Se falhar - Timeout:
```
❌ Exceção: Timeout
Stack: ...

→ SOLUÇÃO: Servidor Zimbra indisponível ou firewall bloqueia acesso
```

---

## 🔐 Checklist de Diagnóstico

- [ ] ZIMBRA_URL está preenchida
- [ ] ZIMBRA_USER está preenchida
- [ ] ZIMBRA_PASS está preenchida
- [ ] USE_ZIMBRA = true
- [ ] Executar `diagnosticoZimbra()` no console
- [ ] Ver resultado dos logs
- [ ] Identificar qual dos erros abaixo se aplica

---

## 🎯 Soluções por Tipo de Erro

### Erro: HTTP 401 (Credenciais)

**Causas possíveis:**
1. Usuário/senha incorretos
2. Usuário não existe no Zimbra
3. Usuário foi desativado
4. Conta foi bloqueada (tentativas múltiplas)

**Solução:**
```
1. Testar login manualmente em: https://mail.pa.gov.br (webmail)
   - Se funcionar manualmente → credenciais estão corretas
   - Se não funcionar → credenciais estão erradas
   
2. Verificar o nome do usuário:
   - Às vezes é "joao" não "joao@pa.gov.br"
   - Às vezes é "joao.silva" não "joao"
   - Solicitar ao admin qual formato usar
   
3. Verificar a senha:
   - Copiar/colar novamente (cuidado com espaços)
   - Testar em máquina Windows (ver se teclado está certo)
   - Se tiver caracteres especiais (é@123), escapar properly
```

---

### Erro: HTTP 404 (URL)

**Causas possíveis:**
1. URL incorreta
2. Servidor Zimbra em URL diferente
3. Typo na URL

**Solução:**
```
URL correta é: https://mail.pa.gov.br/service/soap

Variações a tentar:
- https://mail.pa.gov.br/service/soap (padrão Zimbra)
- https://webmail.pa.gov.br/service/soap
- https://mail.pa.gov.br:7071/service/soap (porta alternativa)
- https://DOMINIO_CORRETO/service/soap

Solicitar ao admin a URL exata do SOAP
```

---

### Erro: HTTP 500 (Servidor)

**Causas possíveis:**
1. Servidor Zimbra com erro
2. Overflow de requisições
3. Manutenção do servidor

**Solução:**
```
- Tentar novamente em alguns minutos
- Solicitar ao admin para verificar saúde do servidor
- Verificar se outros clientes conseguem conectar
```

---

### Erro: Timeout (Rede)

**Causas possíveis:**
1. Firewall bloqueando acesso
2. Servidor indisponível
3. Problema de rede
4. DNS não resolvendo

**Solução:**
```
- Testar com nslookup: nslookup mail.pa.gov.br
- Testar com ping: ping mail.pa.gov.br
- Testar com curl (se tiver): 
  curl -k https://mail.pa.gov.br/service/soap
- Solicitar ao admin para liberar firewall para IP do Google Apps Script
```

---

## 💡 DICA: Formato do Usuário

No Zimbra, o usuário pode ser especificado de várias formas:

```
Opção 1 (com domínio):
ZIMBRA_USER = joao.silva@pa.gov.br

Opção 2 (sem domínio, se for padrão):
ZIMBRA_USER = joao.silva

Opção 3 (apenas nome de usuário):
ZIMBRA_USER = joao
```

**Como saber qual usar?**
1. Testar login no webmail: https://mail.pa.gov.br
2. Usar o mesmo usuário que digita no webmail

---

## 📞 Se Nada Funcionar

1. **Executar `diagnosticoZimbra()`** e copiar todos os logs
2. **Solicitar ao Admin Zimbra:**
   - URL exata do servidor SOAP
   - Formato correto do usuário
   - Se o usuário tem permissão para enviar emails
   - Se há restrições de IP/firewall
3. **Trazer os logs do diagnóstico** para análise

---

## ✅ Próximo Passo

Depois de fazer o diagnóstico:

1. Se funcionar → Remover função `diagnosticoZimbra()` do código
2. Se não funcionar → Compartilhar logs comigo para ajudar a debugar

---

**Status:** 🔄 Aguardando diagnóstico

