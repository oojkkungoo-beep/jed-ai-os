// Jed Finance Tracker — GAS + Sheets backend
// Sheets: Accounts, Transactions, Debts, DebtLogs, Reserves, Investments, RecurringBills

function getSS() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

var SCHEMAS = {
  Accounts: ['Name', 'Type', 'Balance', 'LastUpdated', 'Note'],
  Transactions: ['Date', 'Type', 'Account', 'ToAccount', 'Category', 'Amount', 'Note', 'Timestamp', 'Id', 'ToAccountType', 'AccountType'],
  Debts: ['Name', 'OriginalAmount', 'RemainingAmount', 'InterestRate', 'MinPayment', 'StartDate', 'TermMonths', 'LastUpdated'],
  DebtLogs: ['DebtName', 'Date', 'Amount', 'RemainingAfter', 'Note', 'Timestamp'],
  Reserves: ['Name', 'Amount', 'LastUpdated', 'Note'],
  Investments: ['Name', 'Type', 'Amount', 'LastUpdated', 'Note'],
  RecurringBills: ['Name', 'Amount', 'DueDay', 'LinkedDebt', 'Active', 'LastNotifiedMonth', 'IntervalMonths', 'StartMonth']
};

function getOrCreateSheet(name) {
  var ss = getSS();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(SCHEMAS[name]);
    sheet.setFrozenRows(1);
  } else if (name === 'Transactions') {
    // แก้บัค: หัวตาราง Transactions ของเดิมไม่ตรงกับตำแหน่งข้อมูลจริง (Account/ToAccount ถูกแทรกกลางตาราง
    // แต่ header แถวแรกไม่เคยอัปเดตตาม) — บังคับเขียน header ทับให้ตรงกับตำแหน่งจริงเสมอ ปลอดภัยเพราะไม่แก้ข้อมูล
    sheet.getRange(1, 1, 1, SCHEMAS.Transactions.length).setValues([SCHEMAS.Transactions]);
  } else {
    ensureColumns(sheet, name);
  }
  if (name === 'Transactions') backfillTransactionIds(sheet);
  return sheet;
}

// เติม Id ให้แถวเก่าที่ยังไม่มี (จำเป็นสำหรับแก้ไข/ลบรายการที่แม่นยำ)
function backfillTransactionIds(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var idCol = colIndex('Transactions', 'Id');
  var range = sheet.getRange(2, idCol, lastRow - 1, 1);
  var ids = range.getValues();
  var changed = false;
  for (var i = 0; i < ids.length; i++) {
    if (!ids[i][0]) { ids[i][0] = Utilities.getUuid(); changed = true; }
  }
  if (changed) range.setValues(ids);
}

// migration ที่ปลอดภัย: เพิ่ม column ใหม่ต่อท้ายถ้า sheet เดิมยังไม่มี (ไม่กระทบข้อมูลเดิม)
function ensureColumns(sheet, name) {
  var want = SCHEMAS[name];
  var have = sheet.getLastColumn();
  if (have < want.length) {
    var toAdd = want.slice(have);
    sheet.getRange(1, have + 1, 1, toAdd.length).setValues([toAdd]);
  }
}

function setup() {
  Object.keys(SCHEMAS).forEach(function(name) { getOrCreateSheet(name); });
  var ss = getSS();
  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  setup();
  var action = e.parameter.action;
  if (action === 'getData') {
    return jsonOut(getAllData());
  }
  var tpl = HtmlService.createTemplateFromFile('index');
  tpl.scriptUrl = ScriptApp.getService().getUrl();
  return tpl.evaluate()
    .setTitle('Jed Finance Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  setup();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var result;
  try {
    switch (action) {
      case 'addAccount': result = addAccount(data); break;
      case 'updateAccount': result = updateAccount(data); break;
      case 'deleteAccount': result = deleteAccount(data); break;
      case 'addTransaction': result = addTransaction(data); break;
      case 'updateTransaction': result = updateTransaction(data); break;
      case 'deleteTransaction': result = deleteTransaction(data); break;
      case 'addDebt': result = addDebt(data); break;
      case 'updateDebt': result = updateDebt(data); break;
      case 'payDebt': result = payDebt(data); break;
      case 'deleteDebt': result = deleteDebt(data); break;
      case 'addReserve': result = addReserve(data); break;
      case 'updateReserve': result = updateReserve(data); break;
      case 'deleteReserve': result = deleteReserve(data); break;
      case 'addInvestment': result = addInvestment(data); break;
      case 'updateInvestment': result = updateInvestment(data); break;
      case 'deleteInvestment': result = deleteInvestment(data); break;
      case 'addBill': result = addBill(data); break;
      case 'updateBill': result = updateBill(data); break;
      case 'deleteBill': result = deleteBill(data); break;
      default: result = { error: 'unknown action: ' + action };
    }
  } catch (err) {
    result = { error: String(err) };
  }
  return jsonOut(result);
}

function nowStr() {
  return Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
}
function todayStr() {
  return Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd');
}

function findRowByName(sheet, name) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(name).trim()) return i + 1; // 1-based
  }
  return -1;
}

function colIndex(sheetName, colName) {
  return SCHEMAS[sheetName].indexOf(colName) + 1; // 1-based
}

// ---------- Accounts ----------
function addAccount(data) {
  var sheet = getOrCreateSheet('Accounts');
  if (findRowByName(sheet, data.name) !== -1) return { error: 'duplicate name' };
  sheet.appendRow([data.name || '', data.type || '', Number(data.balance) || 0, nowStr(), data.note || '']);
  return { ok: true };
}

function updateAccount(data) {
  var sheet = getOrCreateSheet('Accounts');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  if (data.balance !== undefined) sheet.getRange(row, colIndex('Accounts', 'Balance')).setValue(Number(data.balance));
  if (data.type !== undefined) sheet.getRange(row, colIndex('Accounts', 'Type')).setValue(data.type);
  if (data.note !== undefined) sheet.getRange(row, colIndex('Accounts', 'Note')).setValue(data.note);
  sheet.getRange(row, colIndex('Accounts', 'LastUpdated')).setValue(nowStr());
  return { ok: true };
}

// ปรับยอดของ "ชื่อ" ใน sheet ใดๆที่มีคอลัมน์ยอดเงิน (Accounts.Balance, Reserves.Amount, Investments.Amount)
function adjustNamedAmount(sheetName, amountCol, name, delta) {
  if (!name) return;
  var sheet = getOrCreateSheet(sheetName);
  var row = findRowByName(sheet, name);
  if (row === -1) return;
  var col = colIndex(sheetName, amountCol);
  var current = Number(sheet.getRange(row, col).getValue()) || 0;
  sheet.getRange(row, col).setValue(current + delta);
  var luCol = colIndex(sheetName, 'LastUpdated');
  if (luCol) sheet.getRange(row, luCol).setValue(nowStr());
}

function adjustAccountBalance(name, delta) {
  adjustNamedAmount('Accounts', 'Balance', name, delta);
}
function adjustReserveAmount(name, delta) {
  adjustNamedAmount('Reserves', 'Amount', name, delta);
}
function adjustInvestmentAmount(name, delta) {
  adjustNamedAmount('Investments', 'Amount', name, delta);
}
// โอนเข้าหนี้ = ชำระหนี้ (ลดยอดคงเหลือ) — amount บวก = ชำระ, ลบ = คืนยอด (ใช้ตอน reverse/edit)
function applyDebtAmountDelta(name, amount) {
  adjustNamedAmount('Debts', 'RemainingAmount', name, -amount);
}

// กระจายเงินไปยัง "ปลายทาง" ตามประเภท (account/reserve/debt/investment)
function applyTransferTo(toType, name, amount) {
  if (toType === 'reserve') adjustReserveAmount(name, amount);
  else if (toType === 'debt') applyDebtAmountDelta(name, amount);
  else if (toType === 'investment') adjustInvestmentAmount(name, amount);
  else adjustAccountBalance(name, amount);
}

// คำนวณผลกระทบของ transaction หนึ่งรายการต่อบัญชี/ปลายทางต่างๆ ด้วยจำนวนเงินที่กำหนด (ใช้ซ้ำตอน add/edit/delete)
function applyTransactionEffect(t, amount) {
  var fromType = t.AccountType || 'account';
  if (t.Type === 'รายรับ') applyTransferTo(fromType, t.Account, amount);
  else if (t.Type === 'รายจ่าย') applyTransferTo(fromType, t.Account, -amount);
  else if (t.Type === 'โอนเงิน') {
    applyTransferTo(fromType, t.Account, -amount);
    applyTransferTo(t.ToAccountType || 'account', t.ToAccount, amount);
  }
}

function deleteAccount(data) {
  var sheet = getOrCreateSheet('Accounts');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  sheet.deleteRow(row);
  return { ok: true };
}

// ---------- Transactions ----------
function findRowById(sheet, sheetName, id) {
  var col = colIndex(sheetName, 'Id');
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][col - 1]) === String(id)) return i + 1; // 1-based
  }
  return -1;
}

function rowToTxObject(sheet, row) {
  var values = sheet.getRange(row, 1, 1, SCHEMAS.Transactions.length).getValues()[0];
  var obj = {};
  SCHEMAS.Transactions.forEach(function(h, i) { obj[h] = values[i]; });
  return obj;
}

function addTransaction(data) {
  var sheet = getOrCreateSheet('Transactions');
  var date = data.date || todayStr();
  var amount = Number(data.amount) || 0;
  var type = data.type || '';
  var account = data.account || '';
  var toAccount = data.toAccount || '';
  var toAccountType = data.toAccountType || 'account';
  var accountType = data.accountType || 'account';
  var id = Utilities.getUuid();
  sheet.appendRow([date, type, account, toAccount, data.category || '', amount, data.note || '', nowStr(), id, toAccountType, accountType]);

  applyTransactionEffect({ Type: type, Account: account, AccountType: accountType, ToAccount: toAccount, ToAccountType: toAccountType }, amount);

  if (type === 'โอนเงิน' && toAccountType === 'debt' && toAccount) {
    var dsheet = getOrCreateSheet('Debts');
    var drow = findRowByName(dsheet, toAccount);
    if (drow !== -1) {
      var remaining = Number(dsheet.getRange(drow, colIndex('Debts', 'RemainingAmount')).getValue()) || 0;
      getOrCreateSheet('DebtLogs').appendRow([toAccount, date, amount, remaining, 'โอนจาก ' + account, nowStr()]);
    }
  }
  return { ok: true, id: id };
}

// แก้ไขได้แค่ วันที่/หมวดหมู่/จำนวนเงิน/โน้ต — ถ้าจำนวนเงินเปลี่ยน จะปรับยอดบัญชีตามส่วนต่างให้อัตโนมัติ
function updateTransaction(data) {
  var sheet = getOrCreateSheet('Transactions');
  var row = findRowById(sheet, 'Transactions', data.id);
  if (row === -1) return { error: 'not found' };
  var old = rowToTxObject(sheet, row);
  var newAmount = data.amount !== undefined ? Number(data.amount) : Number(old.Amount);
  var delta = newAmount - Number(old.Amount);
  if (delta !== 0) applyTransactionEffect(old, delta);
  if (data.date !== undefined) sheet.getRange(row, colIndex('Transactions', 'Date')).setValue(data.date);
  if (data.category !== undefined) sheet.getRange(row, colIndex('Transactions', 'Category')).setValue(data.category);
  if (data.amount !== undefined) sheet.getRange(row, colIndex('Transactions', 'Amount')).setValue(newAmount);
  if (data.note !== undefined) sheet.getRange(row, colIndex('Transactions', 'Note')).setValue(data.note);
  return { ok: true };
}

function deleteTransaction(data) {
  var sheet = getOrCreateSheet('Transactions');
  var row = findRowById(sheet, 'Transactions', data.id);
  if (row === -1) return { error: 'not found' };
  var old = rowToTxObject(sheet, row);
  applyTransactionEffect(old, -Number(old.Amount));
  sheet.deleteRow(row);
  return { ok: true };
}

// ---------- Debts ----------
function addDebt(data) {
  var sheet = getOrCreateSheet('Debts');
  if (findRowByName(sheet, data.name) !== -1) return { error: 'duplicate name' };
  sheet.appendRow([
    data.name || '', Number(data.originalAmount) || 0, Number(data.remainingAmount) || 0,
    Number(data.interestRate) || 0, Number(data.minPayment) || 0,
    data.startDate || todayStr(), Number(data.termMonths) || 0, nowStr()
  ]);
  return { ok: true };
}

function updateDebt(data) {
  var sheet = getOrCreateSheet('Debts');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  if (data.remainingAmount !== undefined) sheet.getRange(row, colIndex('Debts', 'RemainingAmount')).setValue(Number(data.remainingAmount));
  if (data.interestRate !== undefined) sheet.getRange(row, colIndex('Debts', 'InterestRate')).setValue(Number(data.interestRate));
  if (data.minPayment !== undefined) sheet.getRange(row, colIndex('Debts', 'MinPayment')).setValue(Number(data.minPayment));
  if (data.termMonths !== undefined) sheet.getRange(row, colIndex('Debts', 'TermMonths')).setValue(Number(data.termMonths));
  sheet.getRange(row, colIndex('Debts', 'LastUpdated')).setValue(nowStr());
  return { ok: true };
}

// บันทึกการจ่ายหนี้ -> ลดยอดคงเหลือ + เขียน logbook, ตัดเงินจากบัญชีถ้าระบุ
function payDebt(data) {
  var sheet = getOrCreateSheet('Debts');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  var amount = Number(data.amount) || 0;
  var col = colIndex('Debts', 'RemainingAmount');
  var remaining = Number(sheet.getRange(row, col).getValue()) || 0;
  var newRemaining = Math.max(0, remaining - amount);
  sheet.getRange(row, col).setValue(newRemaining);
  sheet.getRange(row, colIndex('Debts', 'LastUpdated')).setValue(nowStr());

  var log = getOrCreateSheet('DebtLogs');
  log.appendRow([data.name, data.date || todayStr(), amount, newRemaining, data.note || '', nowStr()]);

  if (data.account) adjustAccountBalance(data.account, -amount);
  return { ok: true, remaining: newRemaining };
}

function deleteDebt(data) {
  var sheet = getOrCreateSheet('Debts');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  sheet.deleteRow(row);
  return { ok: true };
}

// ---------- Reserves ----------
function addReserve(data) {
  var sheet = getOrCreateSheet('Reserves');
  sheet.appendRow([data.name || '', Number(data.amount) || 0, nowStr(), data.note || '']);
  return { ok: true };
}

function updateReserve(data) {
  var sheet = getOrCreateSheet('Reserves');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  if (data.amount !== undefined) sheet.getRange(row, colIndex('Reserves', 'Amount')).setValue(Number(data.amount));
  sheet.getRange(row, colIndex('Reserves', 'LastUpdated')).setValue(nowStr());
  if (data.note !== undefined) sheet.getRange(row, colIndex('Reserves', 'Note')).setValue(data.note);
  return { ok: true };
}

function deleteReserve(data) {
  var sheet = getOrCreateSheet('Reserves');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  sheet.deleteRow(row);
  return { ok: true };
}

// ---------- Investments ----------
function addInvestment(data) {
  var sheet = getOrCreateSheet('Investments');
  sheet.appendRow([data.name || '', data.type || '', Number(data.amount) || 0, nowStr(), data.note || '']);
  return { ok: true };
}

function updateInvestment(data) {
  var sheet = getOrCreateSheet('Investments');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  if (data.amount !== undefined) sheet.getRange(row, colIndex('Investments', 'Amount')).setValue(Number(data.amount));
  sheet.getRange(row, colIndex('Investments', 'LastUpdated')).setValue(nowStr());
  if (data.note !== undefined) sheet.getRange(row, colIndex('Investments', 'Note')).setValue(data.note);
  return { ok: true };
}

function deleteInvestment(data) {
  var sheet = getOrCreateSheet('Investments');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  sheet.deleteRow(row);
  return { ok: true };
}

// ---------- Recurring Bills ----------
function currentYM() {
  return Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM');
}

function ymToIndex(ym) {
  var p = String(ym).split('-');
  return Number(p[0]) * 12 + Number(p[1]);
}

// บิลถึงรอบจ่ายในเดือนนี้ไหม ตาม IntervalMonths (1=ทุกเดือน, 2=ทุก 2 เดือน, ...)
function isBillDueThisCycle(b, ymIndex) {
  var startIdx = ymToIndex(b.StartMonth || currentYM());
  var interval = Number(b.IntervalMonths) || 1;
  var diff = ymIndex - startIdx;
  return diff >= 0 && (diff % interval === 0);
}

function addBill(data) {
  var sheet = getOrCreateSheet('RecurringBills');
  sheet.appendRow([
    data.name || '', Number(data.amount) || 0, Number(data.dueDay) || 1, data.linkedDebt || '',
    true, '', Number(data.intervalMonths) || 1, data.startMonth || currentYM()
  ]);
  return { ok: true };
}

function updateBill(data) {
  var sheet = getOrCreateSheet('RecurringBills');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  if (data.amount !== undefined) sheet.getRange(row, colIndex('RecurringBills', 'Amount')).setValue(Number(data.amount));
  if (data.dueDay !== undefined) sheet.getRange(row, colIndex('RecurringBills', 'DueDay')).setValue(Number(data.dueDay));
  if (data.active !== undefined) sheet.getRange(row, colIndex('RecurringBills', 'Active')).setValue(data.active);
  if (data.intervalMonths !== undefined) sheet.getRange(row, colIndex('RecurringBills', 'IntervalMonths')).setValue(Number(data.intervalMonths));
  if (data.linkedDebt !== undefined) sheet.getRange(row, colIndex('RecurringBills', 'LinkedDebt')).setValue(data.linkedDebt);
  return { ok: true };
}

function deleteBill(data) {
  var sheet = getOrCreateSheet('RecurringBills');
  var row = findRowByName(sheet, data.name);
  if (row === -1) return { error: 'not found' };
  sheet.deleteRow(row);
  return { ok: true };
}

// เช็คบิลที่ใกล้ครบกำหนด (ใน 3 วันข้างหน้า) แล้วส่งอีเมลแจ้งเตือน — รันทุกวันผ่าน time trigger
function checkUpcomingBills() {
  var sheet = getOrCreateSheet('RecurringBills');
  var rows = sheetToObjects(sheet);
  var today = new Date();
  var todayDay = today.getDate();
  var ym = currentYM();
  var ymIndex = ymToIndex(ym);
  var due = [];
  rows.forEach(function(b, idx) {
    if (b.Active === false || b.Active === 'FALSE') return;
    if (!isBillDueThisCycle(b, ymIndex)) return;
    var dueDay = Number(b.DueDay);
    var diff = dueDay - todayDay;
    if (diff >= 0 && diff <= 3 && b.LastNotifiedMonth !== ym) {
      due.push(b);
      sheet.getRange(idx + 2, colIndex('RecurringBills', 'LastNotifiedMonth')).setValue(ym);
    }
  });
  if (due.length > 0) {
    var body = due.map(function(b) {
      return '- ' + b.Name + ': ' + Number(b.Amount).toLocaleString() + ' บาท (ครบกำหนดวันที่ ' + b.DueDay + ')';
    }).join('\n');
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: '💰 แจ้งเตือนบิลที่ใกล้ครบกำหนด — Jed Finance Tracker',
      body: 'รายการบิลที่ใกล้ครบกำหนดจ่ายใน 3 วันนี้:\n\n' + body
    });
  }
}

// รันครั้งเดียวเพื่อตั้ง trigger รายวัน (เช็คทุกเช้า 8:00)
function setupDailyReminder() {
  var existing = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === 'checkUpcomingBills';
  });
  if (existing.length === 0) {
    ScriptApp.newTrigger('checkUpcomingBills').timeBased().atHour(8).everyDays(1).create();
  }
}

// ---------- Read all data for dashboard ----------
function cleanValue(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  }
  return v;
}

function sheetToObjects(sheet) {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) obj[headers[j]] = cleanValue(values[i][j]);
    out.push(obj);
  }
  return out;
}

function getAllData() {
  return {
    accounts: sheetToObjects(getOrCreateSheet('Accounts')),
    transactions: sheetToObjects(getOrCreateSheet('Transactions')),
    debts: sheetToObjects(getOrCreateSheet('Debts')),
    debtLogs: sheetToObjects(getOrCreateSheet('DebtLogs')),
    reserves: sheetToObjects(getOrCreateSheet('Reserves')),
    investments: sheetToObjects(getOrCreateSheet('Investments')),
    bills: sheetToObjects(getOrCreateSheet('RecurringBills'))
  };
}
