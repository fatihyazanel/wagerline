import {db} from '../database/init'
export async function initShop(){
 await db.prepare(`CREATE TABLE IF NOT EXISTS shop_products(id INTEGER PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL,image_url TEXT NOT NULL DEFAULT '',points INTEGER NOT NULL CHECK(points>0),stock INTEGER NOT NULL CHECK(stock>=0),active INTEGER NOT NULL DEFAULT 0 CHECK(active IN (0,1)),created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run()
 const columns=await db.prepare('PRAGMA table_info(shop_products)').all()
 if(!columns.some(c=>c.name==='revision'))await db.prepare('ALTER TABLE shop_products ADD COLUMN revision INTEGER NOT NULL DEFAULT 0').run()
 await db.prepare('CREATE TRIGGER IF NOT EXISTS shop_product_revision AFTER UPDATE OF name,description,image_url,points,stock,active ON shop_products BEGIN UPDATE shop_products SET revision=revision+1 WHERE id=NEW.id; END').run()
 await db.prepare(`CREATE TABLE IF NOT EXISTS shop_contacts(profile_id TEXT PRIMARY KEY REFERENCES personal_profiles(id),recipient TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL,city TEXT NOT NULL,postal_code TEXT NOT NULL,country TEXT NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run()
 await db.prepare(`CREATE TABLE IF NOT EXISTS shop_orders(id INTEGER PRIMARY KEY,profile_id TEXT NOT NULL REFERENCES personal_profiles(id),product_id INTEGER NOT NULL REFERENCES shop_products(id),product_name TEXT NOT NULL,points INTEGER NOT NULL CHECK(points>0),request_key TEXT NOT NULL,recipient TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL,city TEXT NOT NULL,postal_code TEXT NOT NULL,country TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','shipped','cancelled')),tracking TEXT NOT NULL DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(profile_id,request_key))`).run()
 await db.prepare('CREATE INDEX IF NOT EXISTS shop_orders_profile ON shop_orders(profile_id,status)').run()
 // A single INSERT and its triggers form one SQLite statement transaction.
 await db.prepare(`CREATE TRIGGER IF NOT EXISTS shop_order_guard BEFORE INSERT ON shop_orders BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM personal_accounts WHERE profile_id=NEW.profile_id) THEN RAISE(ABORT,'SIGN_IN_REQUIRED') END;
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM shop_products WHERE id=NEW.product_id AND active=1 AND stock>0 AND points=NEW.points AND name=NEW.product_name) THEN RAISE(ABORT,'PRODUCT_UNAVAILABLE') END;
 SELECT CASE WHEN COALESCE((SELECT SUM(amount) FROM personal_xp_ledger WHERE profile_id=NEW.profile_id),0)-COALESCE((SELECT SUM(points) FROM shop_orders WHERE profile_id=NEW.profile_id AND status!='cancelled'),0)<NEW.points THEN RAISE(ABORT,'INSUFFICIENT_POINTS') END;
 END`).run()
 await db.prepare('CREATE TRIGGER IF NOT EXISTS shop_reserve_stock AFTER INSERT ON shop_orders BEGIN UPDATE shop_products SET stock=stock-1,updated_at=CURRENT_TIMESTAMP WHERE id=NEW.product_id; END').run()
 await db.prepare(`CREATE TRIGGER IF NOT EXISTS shop_order_transition BEFORE UPDATE ON shop_orders BEGIN
 SELECT CASE WHEN NEW.profile_id<>OLD.profile_id OR NEW.product_id<>OLD.product_id OR NEW.points<>OLD.points OR NEW.request_key<>OLD.request_key THEN RAISE(ABORT,'IMMUTABLE_ORDER') END;
 SELECT CASE WHEN NEW.status<>OLD.status AND NOT(OLD.status='pending' AND NEW.status IN ('shipped','cancelled')) THEN RAISE(ABORT,'INVALID_ORDER_TRANSITION') END;
 END`).run()
 await db.prepare("CREATE TRIGGER IF NOT EXISTS shop_return_stock AFTER UPDATE OF status ON shop_orders WHEN OLD.status='pending' AND NEW.status='cancelled' BEGIN UPDATE shop_products SET stock=stock+1,updated_at=CURRENT_TIMESTAMP WHERE id=NEW.product_id; END").run()
}
export async function wallet(profile:string){const r=await db.prepare("SELECT COALESCE((SELECT SUM(amount) FROM personal_xp_ledger WHERE profile_id=?),0) earned,COALESCE((SELECT SUM(points) FROM shop_orders WHERE profile_id=? AND status!='cancelled'),0) spent").get(profile,profile);return {...r,available:Math.max(0,r.earned-r.spent),adjustment:Math.min(0,r.earned-r.spent)}}
