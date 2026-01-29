# Script de Deploy Homologação -> Produção
# Execute no PowerShell

# Deploy Homologação - Atendimento
cd Homologacao/Atendimento
clasp push
clasp deploy --deploymentId "AKfycbyjHfu_JThCljCgGYNOMn38cO4OwBNcBgEiWlQnMMLV29uao5FSsSTXUr-kc1B8ed9j" --description "Deploy Homologação Atendimento"
cd ../..

# Deploy Homologação - Cidadao
cd Homologacao/Cidadao
clasp push
clasp deploy --deploymentId "AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg" --description "Deploy Homologação Cidadao"
cd ../..

# Deploy Homologação - Email
cd Homologacao/Email
clasp push
clasp deploy --deploymentId "AKfycbzVUDExZbAyLYVQ-8CAbAg3JjKA3cQ1NVv60P3-c9F2HC8Gtvkr4wb1uxjgrf65NZF7" --description "Deploy Homologação Email"
cd ../..


# Aguarde validação manual dos testes na Homologação
Read-Host "Teste o sistema na Homologação. Pressione Enter para continuar o deploy para Produção..."

# Sincronize arquivos (exceto configs) para Produção
Copy-Item -Path "Homologacao/Atendimento/src/*" -Destination "Producao/Atendimento/src/" -Exclude "appsscript.json",".clasp.json" -Force
Copy-Item -Path "Homologacao/Cidadao/src/*" -Destination "Producao/Cidadao/src/" -Exclude "appsscript.json",".clasp.json" -Force
Copy-Item -Path "Homologacao/Email/src/*" -Destination "Producao/Email/src/" -Exclude "appsscript.json",".clasp.json" -Force

# Deploy Produção - Atendimento
cd Producao/Atendimento
clasp push
clasp deploy --deploymentId "AKfycbyjHfu_JThCljCgGYNOMn38cO4OwBNcBgEiWlQnMMLV29uao5FSsSTXUr-kc1B8ed9j" --description "Deploy Produção Atendimento"
cd ../..

# Deploy Produção - Cidadao
cd Producao/Cidadao
clasp push
clasp deploy --deploymentId "AKfycbxvkce95ZEE84wqed5ltl1ZgkHyt4CGyPzMiq-zHJfXkHyL01X70xWU0Ot14scMd3sW" --description "Deploy Produção Cidadao"
cd ../..

# Deploy Produção - Email
cd Producao/Email
clasp push
clasp deploy --deploymentId "AKfycbzVUDExZbAyLYVQ-8CAbAg3JjKA3cQ1NVv60P3-c9F2HC8Gtvkr4wb1uxjgrf65NZF7" --description "Deploy Produção Email"
cd ../..


Write-Host "Deploy finalizado!"
