import Dexie, {type EntityTable} from 'dexie';
import type {Category, Item, ShopDTO} from "~src/columns/TBShopSimple";

const db = new Dexie('taobao') as Dexie & {
  shop: EntityTable<ShopDTO, 'sellerId'>,
  item: EntityTable<Item, 'itemId'>,
  category: EntityTable<Category, 'categoryId'>,
};

// Schema declaration:
db.version(1).stores({
  shop: '++sellerId, shopName, wangwang', // primary key "id" (for the runtime!)
  item: '++itemId, title, sellerId, cateId',
  category: '++categoryId, categoryName'
});

export {db};