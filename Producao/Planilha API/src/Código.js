function doGet(e) {
  const action = e.parameter.action;
  if (action === 'listSheets') {
    return ContentService.createTextOutput(JSON.stringify(listSheets())).setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'readSheet') {
    return ContentService.createTextOutput(JSON.stringify(readSheet(e.parameter.sheet))).setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'createRow') {
    return ContentService.createTextOutput(JSON.stringify(createRow(e.parameter.sheet, JSON.parse(e.postData.contents)))).setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'updateRow') {
    return ContentService.createTextOutput(JSON.stringify(updateRow(e.parameter.sheet, parseInt(e.parameter.row), JSON.parse(e.postData.contents)))).setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'deleteRow') {
    return ContentService.createTextOutput(JSON.stringify(deleteRow(e.parameter.sheet, parseInt(e.parameter.row)))).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({erro: 'Ação não reconhecida'})).setMimeType(ContentService.MimeType.JSON);
}

function listSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets().map(s => s.getName());
}

function readSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {erro: 'Aba não encontrada'};
  const data = sheet.getDataRange().getValues();
  return {headers: data[0], rows: data.slice(1)};
}

function createRow(sheetName, rowData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {erro: 'Aba não encontrada'};
  sheet.appendRow(rowData);
  return {sucesso: true};
}

function updateRow(sheetName, row, rowData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {erro: 'Aba não encontrada'};
  sheet.getRange(row + 1, 1, 1, rowData.length).setValues([rowData]);
  return {sucesso: true};
}

function deleteRow(sheetName, row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {erro: 'Aba não encontrada'};
  sheet.deleteRow(row + 1);
  return {sucesso: true};
}
