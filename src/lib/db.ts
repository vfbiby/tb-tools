import Dexie, {type EntityTable} from 'dexie';
import type {Category, Item, ShopDTO} from "~src/columns/TBShopSimple";

const db = new Dexie('taobao') as Dexie & {
  shop: EntityTable<ShopDTO, 'userId'>,
  item: EntityTable<Item, 'userId'>,
  category: EntityTable<Category, 'categoryId'>,
};

// Schema declaration:
db.version(1).stores({
  shop: '++userId, shopName, wangwang', // primary key "id" (for the runtime!)
  item: '++itemId, title, userId, cateId',
  category: '++categoryId, categoryName'
});

export {db};