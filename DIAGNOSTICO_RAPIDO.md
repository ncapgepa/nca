# 🔧 FUNÇÃO DIAGNOSTICOAMBRA - Guia Rápido

**Status:** ✅ Implementada e disponível  
**Arquivo:** `Homologacao/Email/src/Codigo.js`  
**Data:** 16 de janeiro de 2026

---

## ⚡ INÍCIO RÁPIDO (1 minuto)

### 1️⃣ Abrir Google Apps Script
```
https://script.google.com
→ Selecionar "SisNCA Email Homologação"
```

### 2️⃣ Executar Diagnóstico
Na **Console** (Execução → Novo Executar):
```javascript
diagnosticoZimbra()
```

### 3️⃣ Ver Resultado
Leia a saída na console e siga as recomendações.

---

## 📊 O que a Função Testa

```
✅ Propriedades do Script configuradas?
✅ Servidor Zimbra responde?
✅ Credenciais estão corretas?
✅ Pode enviar emails?
✅ Sheet está acessível?
```

---

## 🎯 Possíveis Resultados

### ✅ TUDO OK!
**Significa:** Sistema pronto  
**Ação:** Teste com email real

### ❌ Propriedades não configuradas
**Ação:** Ir a Projeto → Propriedades do Script e adicionar:
```
ZIMBRA_URL  = https://mail.pa.gov.br/service/soap
ZIMBRA_USER = seu@email.com
ZIMBRA_PASS = sua_senha
USE_ZIMBRA  = true
```

### ❌ Falha na autenticação
**Ação:** 
1. Testar login em https://mail.pa.gov.br
2. Verificar user/senha nas propriedades
3. Procurar espaços em branco invisíveis

### ❌ Permissão de envio negada
**Ação:** Contatar administrador Zimbra

### ❌ Sheet não acessível
**Ação:** Verificar SHEET_ID nas constantes do código

---

## 📝 Exemplo de Saída

```
============================================================
📋 DIAGNÓSTICO ZIMBRA
============================================================
{
  "timestamp": "16/1/2026, 15:30:45",
  "testes": {
    "propriedades": {
      "status": "✅ OK"
    },
    "conectividade": {
      "status": "✅ Servidor respondeu (HTTP 200)"
    },
    "autenticacao": {
      "status": "✅ Autenticado",
      "token": "✅ Token gerado"
    },
    "permissao": {
      "status": "✅ Permissão OK"
    },
    "sheet": {
      "status": "✅ Acessível"
    }
  },
  "resumo": "✅ TUDO OK! Sistema pronto para enviar emails via Zimbra"
}
============================================================
```

---

## 🆘 Se Ainda Não Funcionar

1. ✅ Execute `diagnosticoZimbra()` novamente
2. ✅ Leia resultado com atenção
3. ✅ Siga recomendação específica
4. ✅ Se persistir → Veja DIAGNOSTICO_ZIMBRA.md

---

## 📚 Documentação Completa

Veja `DIAGNOSTICO_ZIMBRA.md` para:
- Interpretação detalhada
- Troubleshooting passo a passo
- Exemplos de erros e soluções
- Dicas importantes

---

**Pronto! Execute `diagnosticoZimbra()` agora mesmo!** 🚀

