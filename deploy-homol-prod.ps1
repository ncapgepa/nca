# Script de Deploy Homologação -> Produção
# Execute no PowerShell

# Deploy Homologação - Atendimento
cd Homologacao/Atendimento/src
clasp push
clasp deploy --deploymentId "<ID_HOMOLOGACAO_ATENDIMENTO>" --description "Deploy Homologação Atendimento"
cd ../../..

# Deploy Homologação - Cidadao
cd Homologacao/Cidadao/src
clasp push
clasp deploy --deploymentId "<ID_HOMOLOGACAO_CIDADAO>" --description "Deploy Homologação Cidadao"
cd ../../..

# Deploy Homologação - Email
cd Homologacao/Email/src
clasp push
clasp deploy --deploymentId "<ID_HOMOLOGACAO_EMAIL>" --description "Deploy Homologação Email"
cd ../../..

# Deploy Homologação - Planilha API
cd Homologacao/Planilha API/src
clasp push
clasp deploy --deploymentId "<ID_HOMOLOGACAO_PLANILHA_API>" --description "Deploy Homologação Planilha API"
cd ../../..

# Aguarde validação manual dos testes na Homologação
Read-Host "Teste o sistema na Homologação. Pressione Enter para continuar o deploy para Produção..."

# Sincronize arquivos (exceto configs) para Produção
Copy-Item -Path "Homologacao/Atendimento/src/*" -Destination "Producao/Atendimento/src/" -Exclude "appsscript.json",".clasp.json" -Force
Copy-Item -Path "Homologacao/Cidadao/src/*" -Destination "Producao/Cidadao/src/" -Exclude "appsscript.json",".clasp.json" -Force
Copy-Item -Path "Homologacao/Email/src/*" -Destination "Producao/Email/src/" -Exclude "appsscript.json",".clasp.json" -Force
Copy-Item -Path "Homologacao/Planilha API/src/*" -Destination "Producao/Planilha API/src/" -Exclude "appsscript.json",".clasp.json" -Force

# Deploy Produção - Atendimento
cd Producao/Atendimento/src
clasp push
clasp deploy --deploymentId "<ID_PRODUCAO_ATENDIMENTO>" --description "Deploy Produção Atendimento"
cd ../../..

# Deploy Produção - Cidadao
cd Producao/Cidadao/src
clasp push
clasp deploy --deploymentId "<ID_PRODUCAO_CIDADAO>" --description "Deploy Produção Cidadao"
cd ../../..

# Deploy Produção - Email
cd Producao/Email/src
clasp push
clasp deploy --deploymentId "<ID_PRODUCAO_EMAIL>" --description "Deploy Produção Email"
cd ../../..

# Deploy Produção - Planilha API
cd Producao/Planilha API/src
clasp push
clasp deploy --deploymentId "<ID_PRODUCAO_PLANILHA_API>" --description "Deploy Produção Planilha API"
cd ../../..

Write-Host "Deploy finalizado!"
