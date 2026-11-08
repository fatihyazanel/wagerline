const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const filename = path.resolve(__dirname, '..', process.env.DATABASE_PATH || 'data/wagerline.db');
const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
const all = sql => new Promise((resolve, reject) => db.all(sql, (e, rows) => e ? reject(e) : resolve(rows)));
(async () => {
  const result = { checkedAt: new Date().toISOString(), integrity: await all('PRAGMA quick_check'), foreignKeys: await all('PRAGMA foreign_key_check'), tables: {} };
  for (const {name} of await all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")) {
    result.tables[name] = (await all(`SELECT COUNT(*) AS count FROM "${name}"`))[0].count;
  }
  result.events = await all('SELECT status,COUNT(*) count,MIN(start_time) oldest,MAX(start_time) newest FROM events GROUP BY status');
  result.news = await all('SELECT MAX(published_at) latest FROM news');
  fs.mkdirSync(path.join(__dirname,'../../artifacts'), { recursive: true });
  fs.writeFileSync(path.join(__dirname,'../../artifacts/database-audit.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, foreignKeys: { count: result.foreignKeys.length, byTable: result.foreignKeys.reduce((counts,row) => { counts[row.table] = (counts[row.table] || 0) + 1; return counts; }, {}) } }, null, 2));
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => db.close());
