/**
 * ทะเบียนเวชภัณฑ์ — Google Apps Script backend
 * Sheets: "Items" (เวชภัณฑ์), "Logbook" (usage/storage/maintenance)
 * Images: เก็บใน Drive folder ที่ระบุ DRIVE_FOLDER_ID
 */

var DRIVE_FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE'; // โฟลเดอร์ Drive สำหรับเก็บรูปเวชภัณฑ์

var ITEM_HEADERS = ['id','name_common','name','name_en_trade','type','brand','vendor','model',
  'stock_no','serial_no','price','qty','budget_year','received_date','location','status',
  'note','image_urls','created_at','updated_at'];

var LOG_HEADERS = ['log_id','item_id','log_type','log_date','detail','by_whom','created_at'];

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function rowToObj_(headers, row, rowNum) {
  var obj = { row_num: rowNum };
  headers.forEach(function (h, i) { obj[h] = row[i]; });
  return obj;
}

function nextId_(sheet) {
  var data = sheet.getDataRange().getValues();
  var max = 0;
  for (var i = 1; i < data.length; i++) {
    var n = Number(data[i][0]);
    if (n > max) max = n;
  }
  return max + 1;
}

function doGet(e) {
  var action = e.parameter.action;
  // ไม่มี action → เป็นการเปิดหน้าเว็บ (รวมถึงสแกน QR ที่มี ?id=)
  if (!action) {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ทะเบียนเวชภัณฑ์')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  try {
    if (action === 'listItems') return jsonOut_(listItems_(e.parameter));
    if (action === 'getItem') return jsonOut_(getItem_(e.parameter.id));
    if (action === 'listLogs') return jsonOut_(listLogs_(e.parameter.item_id));
    if (action === 'types') return jsonOut_(distinctValues_('type'));
    return jsonOut_({ error: 'unknown action' });
  } catch (err) {
    return jsonOut_({ error: err.message });
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents || '{}');
  var action = data.action;
  try {
    if (action === 'addItem') return jsonOut_(addItem_(data));
    if (action === 'updateItem') return jsonOut_(updateItem_(data));
    if (action === 'deleteItem') return jsonOut_(deleteItem_(data));
    if (action === 'addLog') return jsonOut_(addLog_(data));
    if (action === 'uploadImage') return jsonOut_(uploadImage_(data));
    return jsonOut_({ error: 'unknown action' });
  } catch (err) {
    return jsonOut_({ error: err.message });
  }
}

function listItems_(params) {
  var sheet = getSheet_('Items', ITEM_HEADERS);
  var data = sheet.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    items.push(rowToObj_(ITEM_HEADERS, data[i], i + 1));
  }
  var q = (params.q || '').toLowerCase();
  var type = params.type || '';
  var status = params.status || '';
  if (q) {
    items = items.filter(function (it) {
      return ['name_common','name','name_en_trade','brand','serial_no','stock_no']
        .some(function (k) { return String(it[k] || '').toLowerCase().indexOf(q) !== -1; });
    });
  }
  if (type) items = items.filter(function (it) { return it.type === type; });
  if (status) items = items.filter(function (it) { return it.status === status; });
  return { items: items };
}

function getItem_(id) {
  var sheet = getSheet_('Items', ITEM_HEADERS);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      return { item: rowToObj_(ITEM_HEADERS, data[i], i + 1) };
    }
  }
  return { error: 'not found' };
}

function distinctValues_(field) {
  var sheet = getSheet_('Items', ITEM_HEADERS);
  var data = sheet.getDataRange().getValues();
  var idx = ITEM_HEADERS.indexOf(field);
  var set = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][idx]) set[data[i][idx]] = true;
  }
  return { values: Object.keys(set) };
}

function addItem_(data) {
  var sheet = getSheet_('Items', ITEM_HEADERS);
  var id = nextId_(sheet);
  var now = new Date().toISOString();
  var row = ITEM_HEADERS.map(function (h) {
    if (h === 'id') return id;
    if (h === 'created_at' || h === 'updated_at') return now;
    return data[h] || '';
  });
  sheet.appendRow(row);
  return { ok: true, id: id };
}

function updateItem_(data) {
  var sheet = getSheet_('Items', ITEM_HEADERS);
  if (!data.row_num) return { error: 'row_num required' };
  var now = new Date().toISOString();
  var row = ITEM_HEADERS.map(function (h) {
    if (h === 'id') return data.id;
    if (h === 'created_at') return data.created_at || now;
    if (h === 'updated_at') return now;
    return data[h] !== undefined ? data[h] : '';
  });
  sheet.getRange(data.row_num, 1, 1, ITEM_HEADERS.length).setValues([row]);
  return { ok: true };
}

function deleteItem_(data) {
  // soft delete — เปลี่ยนสถานะเป็น "ตัดจำหน่าย" เพื่อรักษา audit trail
  var sheet = getSheet_('Items', ITEM_HEADERS);
  if (!data.row_num) return { error: 'row_num required' };
  var statusCol = ITEM_HEADERS.indexOf('status') + 1;
  var updatedCol = ITEM_HEADERS.indexOf('updated_at') + 1;
  sheet.getRange(data.row_num, statusCol).setValue('ตัดจำหน่าย');
  sheet.getRange(data.row_num, updatedCol).setValue(new Date().toISOString());
  return { ok: true };
}

function listLogs_(itemId) {
  var sheet = getSheet_('Logbook', LOG_HEADERS);
  var data = sheet.getDataRange().getValues();
  var logs = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (String(data[i][1]) === String(itemId)) {
      logs.push(rowToObj_(LOG_HEADERS, data[i], i + 1));
    }
  }
  logs.sort(function (a, b) { return new Date(b.log_date) - new Date(a.log_date); });
  return { logs: logs };
}

function addLog_(data) {
  var sheet = getSheet_('Logbook', LOG_HEADERS);
  var id = nextId_(sheet);
  var now = new Date().toISOString();
  var row = LOG_HEADERS.map(function (h) {
    if (h === 'log_id') return id;
    if (h === 'created_at') return now;
    return data[h] || '';
  });
  sheet.appendRow(row);
  return { ok: true, log_id: id };
}

/** data: { filename, mimeType, base64, item_id } */
function uploadImage_(data) {
  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var bytes = Utilities.base64Decode(data.base64);
  var blob = Utilities.newBlob(bytes, data.mimeType, data.filename);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var url = 'https://lh3.googleusercontent.com/d/' + file.getId() + '=w1920';
  return { ok: true, url: url, file_id: file.getId() };
}
