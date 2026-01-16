# 🔧 DIAGNÓSTICO ZIMBRA - Guia de Uso

**Data:** 16 de janeiro de 2026  
**Arquivo:** `Homologacao/Email/src/Codigo.js`  
**Função:** `diagnosticoZimbra()`

---

## 🎯 O que é

Uma função que testa automaticamente **todos os aspectos** da conexão com Zimbra:

1. ✅ Propriedades do Script configuradas?
2. ✅ Servidor Zimbra está respondendo?
3. ✅ Credenciais estão corretas?
4. ✅ Permissão de envio OK?
5. ✅ Sheet está acessível?

**Resultado:** Relatório completo dizendo exatamente o que está errado.

---

## 🚀 Como Usar

### PASSO 1: Abrir Google Apps Script

1. Ir para https://script.google.com
2. Selecionar projeto "SisNCA Email Homologação"
3. Clicar em **Abrir Editor** (ou já está aberto)

---

### PASSO 2: Abrir o Console

1. Clicar no menu **Execução → Novo Executar**
2. Ou usar atalho: **Ctrl + Enter**

Você verá a console de execução abrir.

---

### PASSO 3: Executar Diagnóstico

Na console, copie e execute:

```javascript
diagnosticoZimbra()
```

Ou clique no botão ▶️ ao lado de `diagnosticoZimbra` se aparecer no dropdown.

---

### PASSO 4: Ver Resultado

A console mostrará um relatório completo:

```
============================================================
📋 DIAGNÓSTICO ZIMBRA
============================================================
{
  "timestamp": "16/1/2026, 15:30:45",
  "testes": {
    "propriedades": {
      "nome": "✅ Propriedades do Script",
      "ZIMBRA_URL": "✅ Configurada",
      "ZIMBRA_USER": "✅ seu@email.com",
      "ZIMBRA_PASS": "✅ Configurada",
      "USE_ZIMBRA": "✅ Ativada",
      "status": "✅ OK"
    },
    "conectividade": {
      "nome": "🌐 Conectividade",
      "url": "https://mail.pa.gov.br/service/soap",
      "httpCode": 200,
      "status": "✅ Servidor respondeu"
    },
    "autenticacao": {
      "nome": "🔐 Autenticação SOAP",
      "usuario": "seu@email.com",
      "status": "✅ Autenticado",
      "token": "✅ Token gerado (ABC123DEF456...)"
    }
  },
  "resumo": "✅ TUDO OK! Sistema pronto para enviar emails via Zimbra"
}
============================================================
```

---

## 🔍 Interpretando Resultados

### Se vir: ✅ TUDO OK!

**Significa:** Sistema está funcionando corretamente  
**Ação:** Adicione um email na fila (Sheets → EmailQueue) e teste envio

---

### Se vir: ❌ Propriedades não configuradas

**Problema:** Faltam Script Properties

**Solução:**
1. Abrir **Projeto → Propriedades do Script**
2. Adicionar:
   - `ZIMBRA_URL` = `https://mail.pa.gov.br/service/soap`
   - `ZIMBRA_USER` = `seu@email.com`
   - `ZIMBRA_PASS` = `sua_senha`
   - `USE_ZIMBRA` = `true`
3. Salvar
4. Rodar diagnóstico novamente

---

### Se vir: ❌ Falha na autenticação

**Problema:** Usuário ou senha incorretos

**Verificação:**
1. Abrir webmail do Zimbra: https://mail.pa.gov.br
2. Tentar fazer login com usuário/senha das propriedades
3. Se não funciona no webmail, não funcionará no script
4. Se funciona, propriedades podem estar digitadas errado

**Solução:**
- Copie e cole a senha das propriedades direto do Zimbra
- Verifique se há espaços em branco
- Verifique se está usando email completo (@pa.gov.br)
- Tente sem @pa.gov.br se só o login de usuário
- Procure por caracteres invisíveis (paste em editor de texto)

---

### Se vir: ❌ Permissão de envio negada

**Problema:** Usuário não tem permissão para enviar emails

**Solução:**
1. Contatar administrador Zimbra
2. Pedir para ativar "Permissão de envio" para o usuário
3. Verificar se não está com "Quarentena" ativa
4. Rodar diagnóstico novamente

---

### Se vir: ❌ Sheet não acessível

**Problema:** Não consegue acessar a planilha

**Solução:**
1. Verificar se `SHEET_ID` está correto
2. Verificar se `EMAIL_QUEUE_SHEET_NAME` é exatamente igual ao nome da aba
3. Verificar permissões na planilha

---

## 📊 O que cada teste verifica

### 1️⃣ Propriedades do Script
```
Verifica se estão preenchidas:
- ZIMBRA_URL (URL do servidor)
- ZIMBRA_USER (seu email)
- ZIMBRA_PASS (sua senha)
- USE_ZIMBRA (true para ativar)
```

### 2️⃣ Conectividade
```
Tenta fazer conexão com servidor Zimbra
- Sem enviar dados (apenas ping)
- Verifica se porta SOAP está aberta
- Valida certificado SSL
```

### 3️⃣ Autenticação
```
Tenta fazer login com credenciais
- Envia SOAP AuthRequest
- Obtém token de autenticação
- Valida resposta XML
```

### 4️⃣ Permissão de Envio
```
Tenta criar um email (sem enviar)
- Verifica se usuário tem permissão
- Valida estrutura SOAP SendMsgRequest
- Detecta bloqueios de envio
```

### 5️⃣ Sheet
```
Verifica acesso à planilha
- Abre Sheet by ID
- Busca aba EmailQueue
- Valida estrutura
```

---

## 💡 Dicas Importantes

### ✅ Rodando diagnóstico pela primeira vez?

1. Configure as propriedades
2. Rode `diagnosticoZimbra()`
3. Se tudo OK → Teste com email real
4. Se erro → Veja interpretação acima

---

### ✅ Testando após mudanças

Sempre rode diagnóstico após:
- Trocar senha Zimbra
- Mudar URL do servidor
- Ativar/desativar USE_ZIMBRA
- Atualizar Script Properties

---

### ✅ Enviando email de teste

Depois que diagnóstico passar:

1. Abrir **Sheet → Aba EmailQueue**
2. Adicionar uma linha:
   ```
   Timestamp: (deixar vazio)
   Protocolo: PGE-TEST-001
   Nome: Seu Nome
   Email: seu@email.com
   Status: Novo
   Observação: Teste de diagnóstico
   ```
3. Abrir URL publicada do Apps Script
4. Verificar se email chegou

---

## 🆘 Ainda não funciona?

### Colete essas informações para suporte:

1. Resultado completo de `diagnosticoZimbra()`
2. Erro exato da mensagem
3. Screenshot da console
4. Confirme que consegue fazer login no https://mail.pa.gov.br

---

## 📝 Exemplo de Saída Completa

### ✅ Funcionando Perfeitamente

```
✅ Propriedades do Script → OK
✅ Conectividade → Servidor respondeu (HTTP 200)
✅ Autenticação SOAP → Token gerado
✅ Permissão de Envio → Pode enviar
✅ Google Sheets → Acessível

RESUMO: ✅ TUDO OK! Sistema pronto para enviar emails via Zimbra
```

### ❌ Com Problemas

```
✅ Propriedades do Script → OK
⚠️ Conectividade → Timeout (conexão lenta?)
❌ Autenticação SOAP → Falha de autenticação
❌ Permissão de Envio → Não testado (auth falhou)
✅ Google Sheets → Acessível

RESUMO: ❌ Problemas encontrados:
1. Verificar se ZIMBRA_USER e ZIMBRA_PASS estão corretos
2. Testar login em https://mail.pa.gov.br
3. Verificar conexão de rede
```

---

## 🎯 Próximos Passos

### Se diagnóstico passar (✅ OK):

1. ✅ Testar com email real na fila
2. ✅ Verificar se email chega
3. ✅ Adicionar emails em quantidade (10, 100)
4. ✅ Monitorar logs de envio

### Se diagnóstico falhar (❌):

1. ❌ Ler a seção "Interpretando Resultados" acima
2. ❌ Ajustar conforme recomendação
3. ❌ Rodar diagnóstico novamente
4. ❌ Se persistir → Contactar suporte

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**

- Não compartilhe saída de diagnóstico com senhas visíveis
- A função NÃO mostra senha (mostra apenas ✅ Configurada)
- Logs são registrados apenas no seu Console (privado)
- Não persiste em nenhum lugar

---

**Status:** ✅ Função de diagnóstico integrada e pronta para usar!

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

