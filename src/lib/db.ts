import Dexie, {type EntityTable} from 'dexie';
import type {Item, ShopDTO} from "~src/columns/TBShopSimple";

const db = new Dexie('taobao') as Dexie & {
  shop: EntityTable<ShopDTO, 'userId'>,
  item: EntityTable<Item, 'userId'>,
};

// Schema declaration:
db.version(1).stores({
  shop: '++userId, shopName, wangwang', // primary key "id" (for the runtime!)
  item: '++itemId, title, userId'
});

export {db};