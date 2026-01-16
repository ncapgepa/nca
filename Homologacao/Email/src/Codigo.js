const SHEET_ID = '1k0ytrIaumadc4Dfp29i5KSdqG93RR2GXMMwBd96jXdQ'; // O MESMO ID da sua planilha
const EMAIL_QUEUE_SHEET_NAME = 'EmailQueue';
// URL base para consulta de protocolo (ajuste conforme o ambiente)
const consultaUrlBase = 'https://script.google.com/macros/s/AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg/exec';

// ===== CONFIGURAÇÃO ZIMBRA =====
const ZIMBRA_URL = PropertiesService.getScriptProperties().getProperty('ZIMBRA_URL') || 'https://mail.pa.gov.br/service/soap';
const ZIMBRA_USER = PropertiesService.getScriptProperties().getProperty('ZIMBRA_USER');
const ZIMBRA_PASS = PropertiesService.getScriptProperties().getProperty('ZIMBRA_PASS');
const USE_ZIMBRA = PropertiesService.getScriptProperties().getProperty('USE_ZIMBRA') === 'true';

/**
 * Autentica no Zimbra e retorna o token.
 * Funciona com qualquer usuário (padrão ou serviço) + senha.
 * @returns {string|null} Token de autenticação ou null em caso de falha
 */
function getZimbraAuthToken() {
  // ✅ Funciona com usuário padrão (ex: joao.silva@pa.gov.br) + senha
  // ✅ Funciona com usuário de serviço (ex: nca-sistema@pa.gov.br) + senha
  // ✅ Qualquer usuário válido do Zimbra com permissão de envio
  
  const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Body>
        <AuthRequest xmlns="urn:zimbraAccount">
          <account by="name">${ZIMBRA_USER}</account>
          <password>${ZIMBRA_PASS}</password>
        </AuthRequest>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const options = {
      method: 'post',
      contentType: 'application/soap+xml; charset=utf-8',
      payload: soapRequest,
      muteHttpExceptions: true,
      followRedirects: true
    };

    const response = UrlFetchApp.fetch(ZIMBRA_URL, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      Logger.log(`❌ Erro na autenticação Zimbra: HTTP ${responseCode}`);
      Logger.log(`Resposta: ${response.getContentText()}`);
      return null;
    }

    const xml = response.getContentText();
    
    // Verificar se há erro na resposta
    if (xml.includes('Fault') || xml.includes('authentication failed')) {
      Logger.log("❌ Falha de autenticação: Usuário ou senha incorretos");
      Logger.log(`Resposta: ${xml.substring(0, 200)}...`);
      return null;
    }
    
    const tokenMatch = xml.match(/<authToken>(.*?)<\/authToken>/);
    
    if (tokenMatch && tokenMatch[1]) {
      Logger.log(`✅ Autenticação Zimbra realizada com sucesso para: ${ZIMBRA_USER}`);
      return tokenMatch[1];
    } else {
      Logger.log("❌ Não foi possível extrair o token da resposta");
      Logger.log(`XML recebido: ${xml.substring(0, 300)}...`);
      return null;
    }
  } catch (error) {
    Logger.log(`❌ Erro ao autenticar com Zimbra: ${error.message}`);
    return null;
  }
}

/**
 * Diagnóstico completo da conexão Zimbra
 * Execute esta função no console para testar configuração
 * @returns {Object} Resultado do diagnóstico com status de cada teste
 */
function diagnosticoZimbra() {
  const resultado = {
    timestamp: new Date().toLocaleString(),
    testes: {},
    resumo: ""
  };
  
  try {
    // TESTE 1: Verificar propriedades configuradas
    resultado.testes.propriedades = {
      nome: "✅ Propriedades do Script",
      ZIMBRA_URL: ZIMBRA_URL ? "✅ Configurada" : "❌ Não configurada",
      ZIMBRA_USER: ZIMBRA_USER ? `✅ ${ZIMBRA_USER}` : "❌ Não configurada",
      ZIMBRA_PASS: ZIMBRA_PASS ? "✅ Configurada (não exibir)" : "❌ Não configurada",
      USE_ZIMBRA: USE_ZIMBRA ? "✅ Ativada" : "⚠️ Desativada"
    };
    
    if (!ZIMBRA_URL || !ZIMBRA_USER || !ZIMBRA_PASS) {
      resultado.testes.propriedades.status = "❌ FALHA: Configure todas as propriedades";
      console.log("❌ FALHA: Propriedades incompletas");
      return resultado;
    }
    resultado.testes.propriedades.status = "✅ OK";
    
    // TESTE 2: Conectividade básica
    console.log("🔍 Teste 1: Verificando conectividade com Zimbra...");
    const testConn = UrlFetchApp.fetch(ZIMBRA_URL, { 
      method: 'post',
      payload: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"></soap:Envelope>',
      muteHttpExceptions: true,
      timeout: 5000
    });
    
    resultado.testes.conectividade = {
      nome: "🌐 Conectividade",
      url: ZIMBRA_URL,
      httpCode: testConn.getResponseCode(),
      status: testConn.getResponseCode() > 0 ? "✅ Servidor respondeu" : "❌ Sem resposta"
    };
    
    // TESTE 3: Autenticação
    console.log("🔍 Teste 2: Testando autenticação...");
    const token = getZimbraAuthToken();
    resultado.testes.autenticacao = {
      nome: "🔐 Autenticação SOAP",
      usuario: ZIMBRA_USER,
      status: token ? "✅ Autenticado" : "❌ Falha na autenticação",
      token: token ? `✅ Token gerado (${token.substring(0, 20)}...)` : "❌ Sem token"
    };
    
    if (!token) {
      resultado.testes.autenticacao.dica = "Verifique usuario/senha nas propriedades do script";
      console.log("❌ Falha na autenticação");
      return resultado;
    }
    
    // TESTE 4: Permissão de envio
    console.log("🔍 Teste 3: Testando permissão de envio...");
    const testEmail = UrlFetchApp.fetch(ZIMBRA_URL, {
      method: 'post',
      contentType: 'application/soap+xml; charset=utf-8',
      payload: `<?xml version="1.0" encoding="UTF-8"?>
        <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
          <soap:Header>
            <context xmlns="urn:zimbra">
              <authToken>${token}</authToken>
            </context>
          </soap:Header>
          <soap:Body>
            <SendMsgRequest xmlns="urn:zimbraMail">
              <m>
                <e t="t" a="ninguem@example.com" p="Teste"/>
                <su>Teste de Diagnóstico</su>
                <mp ct="text/html">
                  <content><![CDATA[Teste]]></content>
                </mp>
              </m>
            </SendMsgRequest>
          </soap:Body>
        </soap:Envelope>`,
      muteHttpExceptions: true,
      timeout: 5000
    });
    
    const responseText = testEmail.getContentText();
    const temErro = responseText.includes('Fault') || responseText.includes('Error');
    
    resultado.testes.permissao = {
      nome: "📧 Permissão de Envio",
      status: !temErro ? "✅ Permissão OK" : "❌ Permissão negada",
      detalhes: temErro ? responseText.substring(0, 200) : "Pode enviar emails"
    };
    
    // TESTE 5: Configuração de Sheet
    console.log("🔍 Teste 4: Verificando Sheet...");
    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(EMAIL_QUEUE_SHEET_NAME);
      resultado.testes.sheet = {
        nome: "📊 Google Sheets",
        sheetId: SHEET_ID.substring(0, 20) + "...",
        sheetName: EMAIL_QUEUE_SHEET_NAME,
        status: "✅ Acessível",
        linhas: sheet.getLastRow()
      };
    } catch (e) {
      resultado.testes.sheet = {
        nome: "📊 Google Sheets",
        status: "❌ Erro: " + e.message
      };
    }
    
    // Resumo final
    const todosOk = Object.values(resultado.testes).every(t => 
      t.status && (t.status.includes("✅") || t.status.includes("⚠️"))
    );
    
    resultado.resumo = todosOk ? 
      "✅ TUDO OK! Sistema pronto para enviar emails via Zimbra" :
      "❌ PROBLEMAS ENCONTRADOS: Veja detalhes acima";
    
    console.log("\n" + "=".repeat(60));
    console.log("📋 DIAGNÓSTICO ZIMBRA");
    console.log("=".repeat(60));
    console.log(JSON.stringify(resultado, null, 2));
    console.log("=".repeat(60));
    
    return resultado;
    
  } catch (error) {
    resultado.resumo = "❌ ERRO: " + error.message;
    console.log(resultado.resumo);
    return resultado;
  }
}

/**
 * Envia e-mail via Zimbra SendMsgRequest.
 * @param {string} token - Token de autenticação do Zimbra
 * @param {string} to - Email do destinatário
 * @param {string} subject - Assunto do email
 * @param {string} htmlBody - Corpo do email em HTML
 * @param {string} displayName - Nome de exibição do remetente
 * @returns {boolean} True se enviado com sucesso, false caso contrário
 */
function sendZimbraEmail(token, to, subject, htmlBody, displayName) {
  // Escapar caracteres especiais no assunto
  const escapedSubject = subject.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  
  const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
        <context xmlns="urn:zimbra">
          <authToken>${token}</authToken>
        </context>
      </soap:Header>
      <soap:Body>
        <SendMsgRequest xmlns="urn:zimbraMail">
          <m>
            <e t="t" a="${to}" p="${displayName}"/>
            <su>${escapedSubject}</su>
            <mp ct="text/html">
              <content><![CDATA[${htmlBody}]]></content>
            </mp>
          </m>
        </SendMsgRequest>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const options = {
      method: 'post',
      contentType: 'application/soap+xml; charset=utf-8',
      payload: soapRequest,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(ZIMBRA_URL, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 200) {
      const xml = response.getContentText();
      if (xml.includes('Fault') || xml.includes('Error')) {
        Logger.log(`❌ Erro ao enviar e-mail Zimbra para ${to}: ${xml}`);
        return false;
      }
      Logger.log(`✅ Email enviado via Zimbra para ${to}`);
      return true;
    } else {
      Logger.log(`❌ Erro HTTP ${responseCode} ao enviar e-mail Zimbra: ${response.getContentText()}`);
      return false;
    }
  } catch (error) {
    Logger.log(`❌ Erro ao enviar email via Zimbra: ${error.message}`);
    return false;
  }
}

/**
 * Esta é a única função deste projeto. Ela é executada assim que a página é aberta.
 */
function doGet(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    const emailQueueSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(EMAIL_QUEUE_SHEET_NAME);

    // Verifica se há linhas para processar
    if (emailQueueSheet.getLastRow() < 2) {
      lock.releaseLock();
      return HtmlService.createHtmlOutput('<p>Nenhum email na fila para ser enviado. Pode fechar esta janela.</p>');
    }

    const dataRange = emailQueueSheet.getRange("A2:F" + emailQueueSheet.getLastRow());
    const data = dataRange.getValues();
    let emailsSent = 0;
    let totalEmails = data.length;

    // HTML de progresso
    let progressHtml = `
      <div id="progress-container" style="max-width:400px;margin:60px auto 0 auto;padding:32px 24px;background:#f7f7f7;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center;">
        <div style="font-size:22px;font-weight:bold;color:#00796b;margin-bottom:18px;">Enviando emails...</div>
        <div id="progress-bar" style="background:#e0e0e0;border-radius:8px;height:24px;width:100%;overflow:hidden;margin-bottom:12px;">
          <div id="progress-fill" style="background:#00796b;height:100%;width:0%;transition:width 0.3s;"></div>
        </div>
        <div id="progress-text" style="font-size:16px;color:#555;">0 de ${totalEmails} enviados</div>
      </div>
      <script>
        function updateProgress(sent, total) {
          var percent = Math.round((sent/total)*100);
          document.getElementById('progress-fill').style.width = percent + '%';
          document.getElementById('progress-text').innerText = sent + ' de ' + total + ' enviados';
        }
      </script>
    `;

    // Mostra progresso inicial
    let output = HtmlService.createHtmlOutput(progressHtml);
    output.setTitle('Envio de Emails');
    // Não é possível atualizar dinamicamente do lado do servidor, mas o usuário verá a tela de progresso

    // Obter token Zimbra se configurado
    let zimbraToken = null;
    if (USE_ZIMBRA) {
      zimbraToken = getZimbraAuthToken();
      if (!zimbraToken) {
        lock.releaseLock();
        return HtmlService.createHtmlOutput('<p>❌ Erro crítico: Falha na autenticação com o servidor Zimbra. Verifique as credenciais nas propriedades do script.</p>');
      }
      Logger.log("✅ Token Zimbra obtido com sucesso");
    }

    if (data.length > 0 && data[0][0] !== "") {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const protocolo = row[1], nomeContribuinte = row[2], emailContribuinte = row[3], novoStatus = row[4], observacao = row[5];

  const assunto = `Atualização do seu Protocolo: ${protocolo}`;
  const consultaUrl = `${consultaUrlBase}?page=consulta&protocolo=${encodeURIComponent(protocolo)}`;
  const corpo = `
<p>Prezado(a) ${nomeContribuinte},</p>
<p>Houve uma atualização no seu pedido de Análise de Prescrição (protocolo <strong>${protocolo}</strong>).</p>
<p><strong>Novo Status:</strong> ${novoStatus}</p>
<p><strong>Observação do Atendente:</strong><br/><i>${observacao}</i></p>
<div style="margin:32px 0 24px 0;text-align:center;">
  <a href="${consultaUrl}" style="display:inline-block;padding:20px 40px;background:#00796b;color:#fff;font-weight:bold;text-decoration:none;border-radius:8px;font-size:22px;box-shadow:0 2px 8px #0002;letter-spacing:1px;">Consultar Protocolo</a>
</div>
<div style="background:#ffe082;color:#b26a00;font-weight:bold;padding:12px 18px;border-radius:6px;margin:24px 0 16px 0;text-align:center;font-size:15px;">
  Por favor, não responda a este e-mail. Esta caixa não é monitorada.
</div>
<p style="margin-top:32px;line-height:1.6;">
Atenciosamente,<br>
Procuradoria-Geral do Estado do Pará<br>
Núcleo de Cobrança Administrativa - NCA
</p>`;

        // Envia email via Zimbra ou Google Mail
        let enviado = false;
        if (USE_ZIMBRA && zimbraToken) {
          enviado = sendZimbraEmail(zimbraToken, emailContribuinte, assunto, corpo, "PGE - Atendimento");
        } else {
          // Fallback para Google Mail
          try {
            MailApp.sendEmail({ to: emailContribuinte, subject: assunto, htmlBody: corpo, name: "PGE - Atendimento" });
            Logger.log(`✅ Email enviado via Google Mail para ${emailContribuinte}`);
            enviado = true;
          } catch (mailError) {
            Logger.log(`❌ Erro ao enviar email via Google Mail: ${mailError.message}`);
            enviado = false;
          }
        }
        
        if (enviado) {
          emailsSent++;
        }
      }
      dataRange.clearContent();
    }

    lock.releaseLock();
    // Mensagem final
    return HtmlService.createHtmlOutput(`
      <div style="max-width:400px;margin:60px auto 0 auto;padding:32px 24px;background:#f7f7f7;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center;">
        <div style="font-size:22px;font-weight:bold;color:#00796b;margin-bottom:18px;">Envio concluído!</div>
        <div style="font-size:18px;color:#333;margin-bottom:12px;">${emailsSent} email(s) enviados com sucesso!</div>
        <button onclick="window.close()" style="margin-top:18px;padding:12px 32px;font-size:16px;background:#00796b;color:#fff;border:none;border-radius:6px;cursor:pointer;">Fechar</button>
      </div>
      <script>setTimeout(function(){ window.close(); }, 4000);</script>
    `);

  } catch (err) {
    Logger.log("Erro no processo de envio de email: " + err.message);
    return HtmlService.createHtmlOutput("<p>Ocorreu um erro ao processar a fila de emails.</p>");
  }
}
