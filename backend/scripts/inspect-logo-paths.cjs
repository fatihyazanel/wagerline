const db=new(require('sqlite3').Database)('data/wagerline.db');db.all("SELECT id,slug,external_id,logo_url FROM teams WHERE logo_url LIKE '/logos/%'",(e,r)=>{console.log(e||r);db.close()});
