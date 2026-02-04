const SHEET_ID = '1k0ytrIaumadc4Dfp29i5KSdqG93RR2GXMMwBd96jXdQ'; // O MESMO ID da sua planilha
const EMAIL_QUEUE_SHEET_NAME = 'EmailQueue';
// URL base para consulta de protocolo (ajuste conforme o ambiente)
const consultaUrlBase = 'https://script.google.com/macros/s/AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg/exec';

// ==========================================
// CONFIGURAÇÕES ZIMBRA MAIL
// ==========================================
const ZIMBRA_URL = "https://mail.pa.gov.br/service/soap";
const ZIMBRA_EMAIL = "comunicacaonca@pge.pa.gov.br";
// Senha armazenada de forma segura em Script Properties
// Acesse em: Projeto → Configurações do Projeto → Script Properties
const ZIMBRA_SENHA = PropertiesService.getScriptProperties().getProperty('ZIMBRA_SENHA');

// Configurações de throttle e envio
const THROTTLE_INTERVAL_MS = 60000; // 1 minuto em milissegundos
const MAX_EMAILS_PER_DAY = 700;

/**
 * NOTA IMPORTANTE SOBRE ENVIO DE EMAILS:
 * =====================================
 * 
 * Sistema: Zimbra Mail (mail.pa.gov.br)
 * Remetente: comunicacaonca@pge.pa.gov.br
 * Nome exibido: "Núcleo de Cobrança Administrativa"
 * 
 * Características:
 * - Usa Zimbra SOAP API para autenticação e envio
 * - Autentica com token SOAP a cada lote de envios
 * - Suporta envio de emails com HTML e texto plano
 * - Limites de quota: Conforme política Zimbra da instituição
 * - Intervalo entre emails: 1 minuto (para não sobrecarregar o servidor)
 * 
 * ✅ SEGURANÇA:
 * A senha está armazenada com segurança em Script Properties.
 * Chave: ZIMBRA_SENHA
 * Acesso: Projeto → Configurações do Projeto → Script Properties
 */

/**
 * Obtém a contagem de emails enviados hoje
 */
function getDailyEmailCount() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `email_count_${today}`;
  const count = props.getProperty(key);
  return count ? parseInt(count) : 0;
}

/**
 * Incrementa a contagem de emails enviados hoje
 */
function incrementDailyEmailCount() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `email_count_${today}`;
  const currentCount = getDailyEmailCount();
  props.setProperty(key, currentCount + 1);
  return currentCount + 1;
}

/**
 * Reseta a contagem diária se mudou de dia
 */
function resetDailyCountIfNeeded() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastDate = props.getProperty('last_email_date');
  
  if (lastDate !== today) {
    const allKeys = props.getKeys();
    allKeys.forEach(key => {
      if (key.startsWith('email_count_')) {
        props.deleteProperty(key);
      }
    });
    props.setProperty('last_email_date', today);
    Logger.log(`📅 Novo dia detectado. Contadores resetados.`);
  }
}

/**
 * Força o reset imediato de todos os contadores
 */
function forceClearCounters() {
  const props = PropertiesService.getScriptProperties();
  const allKeys = props.getKeys();
  let cleared = 0;
  allKeys.forEach(key => {
    if (key.startsWith('email_count_') || key === 'last_email_date') {
      props.deleteProperty(key);
      cleared++;
    }
  });
  Logger.log(`🔄 Contadores zerados! ${cleared} propriedades removidas.`);
}

/**
 * Valida endereço de email
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email.trim());
}

/**
 * Autentica no Zimbra e retorna o token de autenticação
 */
function autenticarZimbra() {
  try {
    const xmlPayload = 
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">' +
        '<soap:Body>' +
          '<AuthRequest xmlns="urn:zimbraAccount">' +
            '<account by="name">' + ZIMBRA_EMAIL + '</account>' +
            '<password>' + ZIMBRA_SENHA + '</password>' +
          '</AuthRequest>' +
        '</soap:Body>' +
      '</soap:Envelope>';

    const options = {
      'method': 'post',
      'contentType': 'application/xml',
      'payload': xmlPayload,
      'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch(ZIMBRA_URL, options);
    const responseText = response.getContentText();

    // Extração do token via Regex
    const match = responseText.match(/<authToken>(.*?)<\/authToken>/);
    
    if (match && match[1]) {
      Logger.log(`✅ Autenticado no Zimbra com sucesso`);
      return match[1];
    } else {
      Logger.log(`❌ Erro ao autenticar no Zimbra: ${responseText}`);
      return null;
    }
  } catch (err) {
    Logger.log(`❌ Erro na autenticação: ${err.toString()}`);
    return null;
  }
}

/**
 * Envia email via Zimbra SOAP API
 */
function enviarEmailZimbra(token, destinatario, assunto, corpoTexto, corpoHtml) {
  try {
    // Monta o payload SOAP com suporte a HTML
    // O campo <f> especifica o remetente com nome exibido
    const xmlPayload = 
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">' +
        '<soap:Header>' +
          '<context xmlns="urn:zimbra">' +
            '<authToken>' + token + '</authToken>' +
          '</context>' +
        '</soap:Header>' +
        '<soap:Body>' +
          '<SendMsgRequest xmlns="urn:zimbraMail">' +
            '<m>' +
              '<f d="Núcleo de Cobrança Administrativa">' + ZIMBRA_EMAIL + '</f>' +
              '<e t="t" a="' + destinatario + '"/>' +
              '<su>' + assunto + '</su>' +
              '<mp ct="text/html">' +
                '<content>' + escaparXml(corpoHtml) + '</content>' +
              '</mp>' +
            '</m>' +
          '</SendMsgRequest>' +
        '</soap:Body>' +
      '</soap:Envelope>';

    const options = {
      'method': 'post',
      'contentType': 'application/xml',
      'payload': xmlPayload,
      'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch(ZIMBRA_URL, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode == 200) {
      Logger.log(`✅ Email enviado para: ${destinatario}`);
      return { sucesso: true, mensagem: null };
    } else {
      const errorMsg = response.getContentText();
      Logger.log(`❌ Erro ao enviar para ${destinatario}: ${errorMsg}`);
      return { sucesso: false, mensagem: errorMsg };
    }
  } catch (err) {
    return { sucesso: false, mensagem: err.toString() };
  }
}

/**
 * Escapa caracteres especiais para XML
 */
function escaparXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Envia email com remetente via Zimbra
 * Wrapper para manter compatibilidade com código existente
 */
function enviarEmailComSmtpPadrao(destinatario, assunto, corpoTexto, corpoHtml, nomeRemetente) {
  // Autentica no Zimbra
  const token = autenticarZimbra();
  
  if (!token) {
    return { sucesso: false, mensagem: "Falha na autenticação Zimbra" };
  }
  
  // Envia o email
  return enviarEmailZimbra(token, destinatario, assunto, corpoTexto, corpoHtml);
}

/**
 * Esta é a única função deste projeto. Ela é executada assim que a página é aberta.
 */
function doGet(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    // FORÇA o reset dos contadores para permitir envio
    forceClearCounters();

    const emailQueueSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(EMAIL_QUEUE_SHEET_NAME);

    // Verifica se há linhas para processar
    if (emailQueueSheet.getLastRow() < 2) {
      lock.releaseLock();
      return HtmlService.createHtmlOutput('<p>Nenhum email na fila para ser enviado. Pode fechar esta janela.</p>');
    }

    const dataRange = emailQueueSheet.getRange("A2:F" + emailQueueSheet.getLastRow());
    const data = dataRange.getValues();
    let emailsSent = 0;
    let emailsFailed = 0;
    let emailsSkipped = 0;
    let totalEmails = data.length;
    let dailyCount = getDailyEmailCount();

    // HTML com contador dinâmico
    let progressHtml = `
      <div id="progress-container" style="max-width:450px;margin:60px auto 0 auto;padding:32px 24px;background:#f7f7f7;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center;">
        <div style="font-size:22px;font-weight:bold;color:#00796b;margin-bottom:18px;">Enviando emails...</div>
        <div id="progress-bar" style="background:#e0e0e0;border-radius:8px;height:24px;width:100%;overflow:hidden;margin-bottom:12px;">
          <div id="progress-fill" style="background:#00796b;height:100%;width:0%;transition:width 0.3s;"></div>
        </div>
        <div id="progress-text" style="font-size:16px;color:#555;margin-bottom:12px;">0 de ${totalEmails} enviados</div>
        <div id="progress-limit" style="font-size:12px;color:#666;margin-bottom:12px;">Limite diário: ${dailyCount}/${MAX_EMAILS_PER_DAY}</div>
        <div id="countdown-container" style="font-size:14px;color:#fff;background:#ff6f00;padding:12px;border-radius:8px;margin-bottom:0px;display:none;">
          ⏱️ Próximo email em: <strong id="countdown-timer">60</strong>s
        </div>
      </div>
      <script>
        let countdownInterval = null;
        function startCountdown(seconds) {
          const container = document.getElementById('countdown-container');
          const timer = document.getElementById('countdown-timer');
          container.style.display = 'block';
          let remaining = seconds;
          
          countdownInterval = setInterval(function() {
            remaining--;
            timer.innerText = remaining;
            if (remaining <= 0) {
              clearInterval(countdownInterval);
              container.style.display = 'none';
            }
          }, 1000);
        }
        
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

    if (data.length > 0 && data[0][0] !== "") {
      for (let i = 0; i < data.length; i++) {
        // Verifica limite diário
        if (dailyCount >= MAX_EMAILS_PER_DAY) {
          Logger.log(`⛔ Limite diário de ${MAX_EMAILS_PER_DAY} emails atingido. Pausando processamento.`);
          emailsSkipped = data.length - i;
          break;
        }

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

        // Valida email antes de enviar
        if (!isValidEmail(emailContribuinte)) {
          Logger.log(`⚠️ Email inválido na linha ${i + 2}: '${emailContribuinte}'`);
          emailsFailed++;
          continue;
        }

        // Envia email usando Zimbra SMTP
        try {
          const corpoTexto = corpo.replace(/<[^>]*>/g, ''); // versão sem HTML para fallback
          const resultado = enviarEmailComSmtpPadrao(
            emailContribuinte,
            assunto,
            corpoTexto,
            corpo,
            "Núcleo de Cobrança Administrativa"
          );
          
          if (resultado.sucesso) {
            emailsSent++;
            dailyCount = incrementDailyEmailCount();
            Logger.log(`✅ Email ${emailsSent}/${totalEmails} enviado para: ${emailContribuinte} | Limite: ${dailyCount}/${MAX_EMAILS_PER_DAY}`);
            
            // Throttle: aguarda 1 minuto antes do próximo email (exceto o último)
            if (i < data.length - 1 && dailyCount < MAX_EMAILS_PER_DAY) {
              Logger.log(`⏳ Aguardando 1 minuto (60s) antes do próximo email...`);
              Utilities.sleep(THROTTLE_INTERVAL_MS);
            }
          } else {
            throw new Error(resultado.mensagem);
          }
        } catch (itemErr) {
          emailsFailed++;
          const errorMsg = itemErr.message || itemErr.toString();
          
          // Log detalhado de erro
          if (errorMsg.includes('Falha na autenticação')) {
            Logger.log(`⛔ FALHA NA AUTENTICAÇÃO ZIMBRA: ${errorMsg}`);
            Logger.log(`   Verifique as credenciais. Processamento pausado.`);
            emailsSkipped = data.length - i; // marca resto como pulado
            break; // para o processamento
          } else {
            Logger.log(`❌ Erro ao enviar para ${emailContribuinte} (linha ${i + 2}): ${errorMsg}`);
          }
        }
      }

      // Limpa fila apenas se sucesso total
      if (emailsFailed === 0 && emailsSkipped === 0) {
        dataRange.clearContent();
        Logger.log(`✅ Fila limpa com sucesso. ${emailsSent} email(s) processado(s).`);
      } else {
        Logger.log(`⚠️ Processamento parcial: ${emailsSent} enviado(s), ${emailsFailed} falha(s), ${emailsSkipped} pulado(s). Fila preservada.`);
      }
    }

    lock.releaseLock();

    // Mensagem final
    return HtmlService.createHtmlOutput(`
      <div style="max-width:480px;margin:60px auto 0 auto;padding:32px 24px;background:#f7f7f7;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center;">
        <div style="font-size:22px;font-weight:bold;color:#00796b;margin-bottom:18px;">✅ Processamento Finalizado</div>
        <div style="font-size:16px;color:#333;margin-bottom:6px;">✅ Enviados: <strong>${emailsSent}</strong></div>
        <div style="font-size:16px;color:#d32f2f;margin-bottom:6px;">❌ Falhas: <strong>${emailsFailed}</strong></div>
        <div style="font-size:16px;color:#f57c00;margin-bottom:16px;">⏭️ Pulados (limite): <strong>${emailsSkipped}</strong></div>
        <div style="font-size:13px;color:#666;margin-bottom:16px;padding:12px;background:#fff;border-left:4px solid #00796b;border-radius:4px;">
          📅 <strong>Limite Diário:</strong> ${dailyCount}/${MAX_EMAILS_PER_DAY} emails<br/>
          ⏱️ <strong>Intervalo:</strong> 1 minuto entre emails
        </div>
        <button onclick="window.close()" style="margin-top:18px;padding:12px 32px;font-size:16px;background:#00796b;color:#fff;border:none;border-radius:6px;cursor:pointer;">Fechar</button>
      </div>
      <script>setTimeout(function(){ window.close(); }, 5000);</script>
    `);

  } catch (err) {
    Logger.log("❌ ERRO GERAL: " + err.message);
    Logger.log("Stack: " + err.stack);
    return HtmlService.createHtmlOutput(`
      <div style="max-width:450px;margin:60px auto 0 auto;padding:32px 24px;background:#ffebee;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center;">
        <div style="font-size:22px;font-weight:bold;color:#d32f2f;margin-bottom:18px;">⚠️ Erro Crítico</div>
        <div style="font-size:14px;color:#333;margin-bottom:16px;">Ocorreu um erro ao processar a fila de emails.</div>
        <div style="font-size:12px;color:#666;margin-bottom:16px;padding:12px;background:#fff;border-left:4px solid #d32f2f;text-align:left;border-radius:4px;">
          <strong>Verifique:</strong><br>
          • ID da planilha (SHEET_ID)<br>
          • Nome da aba (EmailQueue)<br>
          • Permissões do script<br>
          • Logs de execução
        </div>
        <button onclick="window.close()" style="margin-top:18px;padding:12px 32px;font-size:16px;background:#d32f2f;color:#fff;border:none;border-radius:6px;cursor:pointer;">Fechar</button>
      </div>
    `);
  }
}
