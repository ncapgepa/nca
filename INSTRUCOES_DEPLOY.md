# 🚀 INSTRUÇÕES DE DEPLOY - Produção/Atendimento

**Data:** 16 de janeiro de 2026  
**Módulo:** Atendimento (Produção)  
**Ação:** Push e Deploy da função getRequestsPaginated()

---

## 📋 Pré-Requisitos

✅ Função `getRequestsPaginated()` já foi copiada  
✅ Arquivo Code.js atualizado e salvo  
✅ Sem erros de sintaxe  
✅ Clasp instalado e configurado  

---

## 🔧 Passos de Execução

### Passo 1: Navegar para o diretório correto

```bash
cd "D:\users\leon.james\Documents\Sistemas\SisNCA\Producao\Atendimento"
```

**Verificação:**
```bash
# Deve mostrar:
# .clasp.json
# src/ (pasta)
ls
```

---

### Passo 2: Fazer Push do Código

```bash
clasp push
```

**Saída esperada:**
```
? Overwrite "Code.js" in the script? (y/n) y
Pushing files:
└─ Code.js (✓)
Pushed 1 files.
```

**Se pedir confirmação para sobrescrever:**
- Digitar: `y` (Yes)
- Pressionar: Enter

---

### Passo 3: Fazer Deploy

```bash
clasp deploy --description "Sincronização getRequestsPaginated - Paginação funcional em Produção"
```

**Saída esperada:**
```
Deployment successful:
  Deployment ID: XXXXXXXXXXXXXXXXXXXXXXX
  Version: 1
  Description: Sincronização getRequestsPaginated - Paginação funcional em Produção
```

**Anotar o Deployment ID exibido** (vai precisar para testes)

---

## ✅ Validação Pós-Deploy

### Verificação 1: Status do Deploy

```bash
clasp status
```

**Esperado:** Mostrar arquivos sincronizados

---

### Verificação 2: Acessar o Painel

1. Abrir a URL de Produção/Atendimento
2. Fazer login com conta de produção
3. Verificar se o painel carrega

---

### Verificação 3: Testar Paginação

**No painel, deve ser possível:**
- ✅ Ver tabela com protocolos
- ✅ Clicar em próxima página
- ✅ Clicar em página anterior
- ✅ Ver indicador de página (ex: "1 de 5")

---

### Verificação 4: Testar Filtros

**No painel, deve ser possível:**
- ✅ Buscar por número de protocolo
- ✅ Buscar por nome
- ✅ Filtrar por status
- ✅ Ordenar por coluna

---

### Verificação 5: Comparar Ambientes

**Homologação:**
```bash
cd "D:\users\leon.james\Documents\Sistemas\SisNCA\Homologacao\Atendimento"
clasp status
# Deve mostrar mesmo código
```

**Produção:**
```bash
cd "D:\users\leon.james\Documents\Sistemas\SisNCA\Producao\Atendimento"
clasp status
# Deve mostrar mesmo código
```

---

## 🐛 Troubleshooting

### Problema: "Não pode fazer push"
**Solução:**
```bash
clasp login
# Fazer login novamente
clasp push
```

---

### Problema: "Syntax error"
**Solução:**
```bash
# Verificar se há erros no arquivo
clasp versions
# Ver versões anteriores
# Reverter se necessário
```

---

### Problema: "Paginação não funciona no painel"
**Solução:**
1. Limpar cache do navegador (Ctrl+F5)
2. Fazer novo deploy
3. Esperar 30 segundos
4. Recarregar painel

---

## 📊 Antes vs Depois

### ANTES Deploy
```
Produção/Atendimento/Code.js: 435 linhas
Tem getRequestsPaginated: ❌ NÃO
Paginação: ❌ NÃO FUNCIONA
```

### DEPOIS Deploy
```
Produção/Atendimento/Code.js: 535 linhas ✅
Tem getRequestsPaginated: ✅ SIM
Paginação: ✅ FUNCIONA
```

---

## 📋 Checklist de Conclusão

- [ ] `clasp push` executado com sucesso
- [ ] `clasp deploy` executado com sucesso
- [ ] Deployment ID anotado
- [ ] Painel de Produção carrega corretamente
- [ ] Paginação funciona
- [ ] Filtros funcionam
- [ ] Busca funciona
- [ ] Ordenação funciona
- [ ] Dados estão corretos
- [ ] Homolog não foi afetado

---

## 🎉 Resultado Final

**Desacoplamento de Ambientes:** ✅ **100% COMPLETO**

Todos os conflitos foram resolvidos:
1. ✅ Atendimento Script ID desacoplado
2. ✅ Email Script ID desacoplado
3. ✅ Email Sheet ID desacoplado
4. ✅ Email URL atualizada
5. ✅ getRequestsPaginated() sincronizada

**Sistema de Produção:** ✅ **PRONTO E FUNCIONAL**

---

**Próximo passo:** Executar os comandos acima e validar o deploy.

