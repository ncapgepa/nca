// URL do Apps Script de homologação (troque para a URL de produção ao migrar)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUiUkAP9XQ3gCo0vOHswNt78jV-SJpx_RulNzgDh6G680XTx8VEA52VA_CdyDd86erGg/exec';
const SHEET_ID = '1k0ytrIaumadc4Dfp29i5KSdqG93RR2GXMMwBd96jXdQ'; 
const REQUESTS_SHEET_NAME = 'Pedidos Prescrição';
const DRIVE_FOLDER_NAME = 'Documentos prescricao (homologacao)';
const ENVIRONMENT = 'homologacao';

// ==========================================
// CONFIGURAÇÕES ZIMBRA MAIL
// ==========================================
const ZIMBRA_URL = "https://mail.pa.gov.br/service/soap";
const ZIMBRA_EMAIL = "comunicacaonca@pge.pa.gov.br";
// Senha armazenada de forma segura em Script Properties
// Acesse em: Projeto → Configurações do Projeto → Script Properties
const ZIMBRA_SENHA = PropertiesService.getScriptProperties().getProperty('ZIMBRA_SENHA');

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
function enviarEmailZimbra(token, destinatario, assunto, corpoHtml) {
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
 * Envia email de confirmação ao cidadão via Zimbra
 */
function sendConfirmationEmail(protocolo, emailDestino, nomeSolicitante) {
  try {
    // Autentica no Zimbra
    const token = autenticarZimbra();
    
    if (!token) {
      Logger.log(`⚠️ Aviso: Falha ao autenticar no Zimbra. Email de confirmação não enviado.`);
      return;
    }
    
    // Prepara o corpo do email
    const assunto = `Protocolo de Análise de Prescrição ${protocolo} - Solicitação Confirmada`;
    const corpoEmail = `
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; }
      .header { background-color: #00796b; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 20px; background-color: white; }
      .protocolo-box { background-color: #e0f2f1; padding: 15px; border-left: 4px solid #00796b; margin: 20px 0; border-radius: 4px; }
      .protocolo-box p { margin: 5px 0; font-size: 14px; }
      .protocolo-number { font-size: 20px; font-weight: bold; color: #00796b; }
      .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; padding: 12px 24px; background-color: #00796b; color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Análise de Prescrição de Dívida Ativa</h1>
        <p>Solicitação Registrada com Sucesso</p>
      </div>
      
      <div class="content">
        <p>Prezado(a) <strong>${nomeSolicitante}</strong>,</p>
        
        <p>Sua solicitação de análise de prescrição de dívida ativa foi registrada com sucesso em nosso sistema.</p>
        
        <div class="protocolo-box">
          <p><strong>Número do Protocolo:</strong></p>
          <p class="protocolo-number">${protocolo}</p>
          <p><strong>Guarde este número!</strong> Você precisará dele para acompanhar sua solicitação.</p>
        </div>
        
        <h3>Próximos Passos:</h3>
        <ul>
          <li>Sua solicitação está sendo analisada pelos nossos técnicos</li>
          <li>Você receberá atualizações por email conforme o andamento</li>
          <li>Pode consultar o status a qualquer momento usando seu protocolo</li>
        </ul>
        
        <p><a href="${APPS_SCRIPT_URL}?page=consulta" class="button">Consultar Meu Protocolo</a></p>
        
        <p><strong>Informações de Contato:</strong><br>
        Para dúvidas sobre sua solicitação, entre em contato conosco através do email ou telefone registrado.</p>
      </div>
      
      <div class="footer">
        <p>Este é um email automático. Por favor, não responda.</p>
        <p>Procuradoria-Geral do Estado do Pará - Núcleo de Cobrança Administrativa (NCA)</p>
        <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
      </div>
    </div>
  </body>
</html>`;

    // Envia o email
    const resultado = enviarEmailZimbra(token, emailDestino, assunto, corpoEmail);
    
    if (resultado.sucesso) {
      Logger.log(`✅ Email de confirmação enviado para: ${emailDestino}`);
    } else {
      Logger.log(`⚠️ Aviso: Erro ao enviar email de confirmação para ${emailDestino}: ${resultado.mensagem}`);
    }
  } catch (err) {
    Logger.log(`⚠️ Aviso: Erro ao enviar email de confirmação: ${err.toString()}`);
  }
}

/**
 * Gera o PDF do protocolo no mesmo modelo do painel do Atendente.
 * Retorna um objeto com fileName, contentType, fileContent em base64
 */
function gerarProtocoloPdfCidadao(protocolo) {
  const dados = consultarProtocolo(protocolo);
  if (dados.erro) {
    throw new Error('Não foi possível gerar o PDF: ' + dados.erro);
  }
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; }
          h1 { color: #333; border-bottom: 2px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          pre { background-color: #f8f8f8; padding: 10px; border: 1px solid #eee; white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>Relatório do Protocolo: ${dados.protocolo}</h1>
        <h3>Dados do Titular da Dívida</h3>
        <table>
          <tr><th>Nome do Titular da Dívida</th><td>${dados.nomeRepresentado || ''}</td></tr>
          <tr><th>CPF/CNPJ do Titular</th><td>${dados.cpfCnpjRepresentado || ''}</td></tr>
        </table>
        <h3>Dados do Representante Legal</h3>
        <table>
          <tr><th>Nome</th><td>${dados.nome}</td></tr>
          <tr><th>E-mail</th><td>${dados.email}</td></tr>
          <tr><th>Telefone</th><td>${dados.telefone}</td></tr>
          <tr><th>Tipo de Requerente</th><td>${dados.tipo}</td></tr>
          <tr><th>Tipo de Representante</th><td>${dados.tipoRepresentante || ''}</td></tr>
          <tr><th>Tipo Documento do Representante</th><td>${dados.tipoDocumentoRepresentante || ''}</td></tr>
          <tr><th>Número do Documento do Representante</th><td>${dados.numeroDocumentoRepresentante || ''}</td></tr>
        </table>
        <h3>Dados do Pedido</h3>
        <table>
          <tr><th>Data da Solicitação</th><td>${dados.data}</td></tr>
          <tr><th>Status Atual</th><td>${dados.status}</td></tr>
          <tr><th>Nº Processo ATTUS/SAJ</th><td>${dados.attusSaj || 'Não informado'}</td></tr>
          <tr><th>CDAs</th><td>${dados.cdas}</td></tr>
        </table>
        <h3>Histórico Completo</h3>
        <pre>${dados.historico || 'Nenhum histórico registado.'}</pre>
        <p style="text-align:center; color:#777; font-size:9px; margin-top: 30px;">
          Documento gerado pelo SisNCA em ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
  const blob = Utilities.newBlob(htmlContent, MimeType.HTML).getAs(MimeType.PDF);
  blob.setName(`Protocolo_${dados.protocolo}.pdf`);
  return {
    fileName: blob.getName(),
    contentType: blob.getContentType(),
    fileContent: Utilities.base64Encode(blob.getBytes())
  };
}


/**
 * Função principal que serve as páginas públicas.
 */
function doGet(e) {
  var page = e.parameter && e.parameter.page ? e.parameter.page : 'cidadao';
  
  if (page === 'consulta') {
    var template = HtmlService.createTemplateFromFile('consulta');
    template.APPS_SCRIPT_URL = APPS_SCRIPT_URL;
    return template.evaluate().setTitle('Consulta de Protocolo');
  } else {
    // A página padrão é a do cidadão
    var template = HtmlService.createTemplateFromFile('cidadao');
    template.APPS_SCRIPT_URL = APPS_SCRIPT_URL;
    return template.evaluate().setTitle('Análise de Prescrição de Dívida Ativa');
  }
}

/**
 * ATUALIZADO: Processa o formulário, agora com protocolo dinâmico.
 */
function submitForm(formObject) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REQUESTS_SHEET_NAME);
    if (!sheet) {
      throw new Error(`A planilha com o nome "${REQUESTS_SHEET_NAME}" não foi encontrada.`);
    }

    const submittedCDAs = Array.isArray(formObject['cda[]']) ? formObject['cda[]'] : [formObject['cda[]']];
    const duplicateCheck = findDuplicateCDAs(sheet, submittedCDAs);
    if (duplicateCheck.isDuplicate) {
      return { erro: `A CDA nº ${duplicateCheck.cda} já existe em uma solicitação com status "${duplicateCheck.status}". Não é possível criar um novo pedido.` };
    }

    // --- INÍCIO DA ALTERAÇÃO ---
    const lastRow = sheet.getLastRow();
    const nextNumber = lastRow;
    const currentYear = new Date().getFullYear(); // Pega o ano atual
    const protocolo = `PGE-PRESC-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
    // --- FIM DA ALTERAÇÃO ---

    const nomeSolicitante = formObject.nome;

    let driveFolder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    let submissionFolder = driveFolder.createFolder(`${protocolo} - ${nomeSolicitante}`);
    let outrosDocumentosLista = [];
    
    // Processa todos os ficheiros enviados, incluindo os dinâmicos
    for (let key in formObject) {
      if (key.startsWith('doc_') && formObject[key] && typeof formObject[key].getName === 'function') {
        let fileBlob = formObject[key];
        let file = submissionFolder.createFile(fileBlob);
        
        // Se for um documento "outro", associa a sua descrição
        if (key.startsWith('doc_outro_')) {
          const fileIndex = key.split('_').pop();
          const descKey = 'desc_outro_' + fileIndex;
          const description = formObject[descKey] || 'Documento sem descrição';
          outrosDocumentosLista.push({ descricao: description, nomeArquivo: file.getName(), url: file.getUrl() });
        }
      }
    }
    const folderUrl = submissionFolder.getUrl();
    const cdasString = submittedCDAs.join(', ');

    // Prepara os novos campos para a planilha
    let nomeRepresentado = formObject.nomeRepresentado || '';
    let cpfCnpjRepresentado = formObject.cpfCnpjRepresentado || '';
    const tipoRepresentante = formObject.tipoRepresentante || '';
    const tipoDocumentoRepresentante = formObject.tipoDocumentoRepresentante || '';
    const numeroDocumentoRepresentante = formObject.numeroDocumentoRepresentante || '';

    // Se não houver representante, o nomeRepresentado recebe o nome do solicitante e o cpfCnpjRepresentado vai para a coluna O
    if (!tipoRepresentante && !tipoDocumentoRepresentante && !numeroDocumentoRepresentante) {
      nomeRepresentado = nomeSolicitante;
      cpfCnpjRepresentado = formObject.cpfCnpjTitular || '';
    }
    // Se houver representante, grava o campo do representado normalmente, mas também grava o cpfCnpjTitular na coluna O
    else if (formObject.cpfCnpjTitular) {
      cpfCnpjRepresentado = formObject.cpfCnpjRepresentado || formObject.cpfCnpjTitular;
    }
    
    const newRow = [
      protocolo,                      // A
      new Date(),                     // B
      nomeSolicitante,                // C (Sempre quem preenche, seja o titular ou representante)
      formObject.email,               // D
      formObject.telefone,            // E
      formObject.tipo,                // F (Refere-se ao titular/representado)
      cdasString,                     // G
      folderUrl,                      // H
      'Novo',                         // I
      '',                             // J (AtendenteResp)
      `Pedido criado em ${new Date().toLocaleString()}`, // K (Historico)
      '',                             // L (DataEncerramento)
      '',                             // M (ATTUS/SAJ) - Coluna vazia por enquanto
      nomeRepresentado,               // N
      cpfCnpjRepresentado,            // O (Agora sempre recebe o CPF/CNPJ do titular, mesmo sem representante)
      tipoRepresentante,              // P (NOVO)
      tipoDocumentoRepresentante,     // Q (NOVO)
      numeroDocumentoRepresentante,   // R (NOVO)
      JSON.stringify(outrosDocumentosLista) // S (Lista de outros documentos)
    ];
    
    sheet.appendRow(newRow);

    sendConfirmationEmail(protocolo, formObject.email, nomeSolicitante);
    return { protocolo: protocolo };

  } catch (error) {
    Logger.log(error.toString());
    return { erro: error.toString() };
  }
}

/**
 * NOVA FUNÇÃO: Procura por CDAs duplicadas na planilha.
 * @param {Sheet} sheet O objeto da planilha de pedidos.
 * @param {Array<string>} cdasToCheck A lista de CDAs enviadas pelo utilizador.
 * @returns {object} Um objeto indicando se há duplicata e qual a CDA.
 */
function findDuplicateCDAs(sheet, cdasToCheck) {
  const cdaColumnIndex = 7; // G = 7
  const statusColumnIndex = 9; // I = 9
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    // Não há dados além do cabeçalho, então não há duplicatas
    return { isDuplicate: false };
  }
  const range = sheet.getRange(2, cdaColumnIndex, lastRow - 1, 3); // Lê as colunas G, H, I
  const data = range.getValues();

  // Cria um mapa de CDAs existentes para o seu status
  const existingCDAs = new Map();
  data.forEach(row => {
    // Garante que row[0] é uma string antes de fazer split
    const cdasString = row[0] ? String(row[0]).trim() : '';
    const cdasInSheet = cdasString ? cdasString.split(',').map(cda => cda.trim()) : [];
    const status = row[statusColumnIndex - cdaColumnIndex]; // Índice relativo ao range lido
    
    // Considera apenas pedidos que não foram indeferidos.
    if (status && String(status).toLowerCase() !== 'indeferido') {
      cdasInSheet.forEach(cda => {
        if (cda) existingCDAs.set(cda, status);
      });
    }
  });

  // Verifica cada CDA enviada contra o mapa de existentes
  for (const cda of cdasToCheck) {
    if (existingCDAs.has(cda.trim())) {
      return { 
        isDuplicate: true, 
        cda: cda.trim(),
        status: existingCDAs.get(cda.trim())
      };
    }
  }

  return { isDuplicate: false };
}


/**
 * Encontra ou cria a pasta no Google Drive.
 */
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Consulta um protocolo para o cidadão.
 */
function consultarProtocolo(protocolo) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REQUESTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === protocolo) {
        return {
          protocolo: data[i][0],
          data: data[i][1] ? (data[i][1].toLocaleString ? data[i][1].toLocaleString() : data[i][1]) : '',
          nome: data[i][2],
          email: data[i][3],
          telefone: data[i][4],
          tipo: data[i][5],
          cdas: data[i][6],
          linkDocumentos: data[i][7],
          status: data[i][8],
          atendente: data[i][9],
          historico: data[i][10],
          dataEncerramento: data[i][11],
          attusSaj: data[i][12],
          nomeRepresentado: data[i][13],
          cpfCnpjRepresentado: data[i][14],
          tipoRepresentante: data[i][15],
          tipoDocumentoRepresentante: data[i][16],
          numeroDocumentoRepresentante: data[i][17],
          outrosDocumentos: data[i][18]
        };
      }
    }
    return { erro: 'Protocolo não encontrado.' };
  } catch (e) {
    return { erro: 'Ocorreu um erro ao consultar.' };
  }
}

/**
 * Recebe um arquivo e anexa à pasta do protocolo, atualizando o histórico.
 * @param {string} protocolo
 * @param {Object} file (google.script.run envia como blob)
 * @param {string} descricao
 */
function enviarDocumentoProtocolo(protocolo, file, descricao) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REQUESTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let folderUrl = '';
    let nomeSolicitante = '';
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === protocolo) {
        rowIndex = i + 1;
        folderUrl = data[i][7]; // Coluna H
        nomeSolicitante = data[i][2];
        break;
      }
    }
    if (rowIndex === -1 || !folderUrl) return { erro: 'Protocolo não encontrado ou pasta não definida.' };
    // Extrai o ID da pasta do link
    var folderId = folderUrl.match(/[-\w]{25,}/);
    if (!folderId) return { erro: 'ID da pasta não encontrado.' };
    var folder = DriveApp.getFolderById(folderId[0]);
    var blob = file;
    if (descricao) blob.setName(descricao + ' - ' + blob.getName());
    var createdFile = folder.createFile(blob);
    // Atualiza histórico
    var historicoAntigo = sheet.getRange(rowIndex, 11).getValue(); // Coluna K
    var novoHistorico = historicoAntigo + `\n${new Date().toLocaleString()} - Documento "${createdFile.getName()}" enviado pelo cidadão.`;
    sheet.getRange(rowIndex, 11).setValue(novoHistorico);
    return { sucesso: true, nomeArquivo: createdFile.getName(), url: createdFile.getUrl() };
  } catch(e) {
    return { erro: 'Erro ao enviar documento: ' + e.message };
  }
}

/**
 * Recebe um formulário com arquivo e anexa à pasta do protocolo, atualizando o histórico.
 * @param {Object} formObject
 */
function enviarDocumentoProtocoloForm(formObject) {
  try {
    var protocolo = formObject.protocolo;
    var file = formObject.arquivoDoc;
    var descricao = formObject.descricao;
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REQUESTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let folderUrl = '';
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === protocolo) {
        rowIndex = i + 1;
        folderUrl = data[i][7]; // Coluna H
        break;
      }
    }
    if (rowIndex === -1 || !folderUrl) return { erro: 'Protocolo não encontrado ou pasta não definida.' };
    var folderId = folderUrl.match(/[-\w]{25,}/);
    if (!folderId) return { erro: 'ID da pasta não encontrado.' };
    var folder = DriveApp.getFolderById(folderId[0]);
    var blob = file;
    if (descricao) blob.setName(descricao + ' - ' + blob.getName());
    var createdFile = folder.createFile(blob);
    var historicoAntigo = sheet.getRange(rowIndex, 11).getValue(); // Coluna K
    var novoHistorico = historicoAntigo + `\n${new Date().toLocaleString()} - Documento "${createdFile.getName()}" enviado pelo cidadão.`;
    sheet.getRange(rowIndex, 11).setValue(novoHistorico);
    return { sucesso: true, nomeArquivo: createdFile.getName(), url: createdFile.getUrl() };
  } catch(e) {
    return { erro: 'Erro ao enviar documento: ' + e.message };
  }
}