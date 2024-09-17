import type {Cate, Category, Item, ShopDTO, TBShopSimpleResponse} from "~src/columns/TBShopSimple";
import type {TBShopSimpleItemResponse} from "~src/columns/TBShopSimpleItem";
import {db} from "~src/lib/db";
import {type ApiResponse, type ApiResponseType, type EventAttachInfo, type Prettify} from "~src/contents/tb-shop-float";

type DataParams = {
  "page": number;
  "orderType": "popular";
  "sortType": string;
  "catId": number;
  "keyword": string;
  "filterType": string;
  "isCustomDecorateCat": boolean;
  "shopId": string;
  "sellerId": string;
}

export let wangwang: string;
export let sellerId: string;
export let cateId: number;

function attachDateUserIdWangWangTo(item: Item, sellerId: string, wangwang: string) {
  if (!sellerId || !wangwang) throw new Error('sellerId or wang can not be null!')
  item.sellerId = sellerId
  item.wangwang = wangwang
  item.createdAt = new Date()
  item.cateId = cateId
}

function attachDateUserIdInfoTo(shop: ShopDTO) {
  if (!sellerId) throw new Error('userId can not be null!')
  shop.sellerId = sellerId
  shop.createdAt = new Date()
}

function assignCateIdUserId(url: string) {
  const params = decodeURIComponent((url.match(/data=(.*)(?=&|$)/))[1]);
  if (!params) throw new Error('ajax url has no data params!')
  const dataParamsObj: DataParams = JSON.parse(params);
  sellerId = dataParamsObj.sellerId
  cateId = dataParamsObj.catId || 0
}

function assignUserIdWangwang(shop: ShopDTO, url: string) {
  if (!shop.shopUrl || !shop.wangwang)
    throw new Error(`shop dto has no shopUrl ${shop.shopUrl} or wangwang ${shop.wangwang}!`)
  assignCateIdUserId(url);
  wangwang = shop.wangwang
}

async function checkCateIdAndUpdate(items: Item[]) {
  for (const item of items) {
    const existItem = await db.item.get(item.itemId);
    if (!existItem) {
      db.item.put(item)
      continue
    }
    if (existItem.cateId === 0 || !existItem.cateId) {
      db.item.update(item.itemId, item)
    } else {
      delete item.cateId
      db.item.update(item.itemId, item)
    }
  }
}

function makeCategories(cates: Cate[], sellerId: string) {
  if (!sellerId) throw new Error('make category error on sellerId missing!')
  const categories: Category[] | null = [];
  cates.forEach(cate => {
    const category: Category = {
      categoryId: cate.categoryId,
      categoryName: cate.categoryName,
      sellerId: sellerId,
      createdAt: new Date()
    };
    categories.push(category)
    cate?.subCategoryInfoList?.forEach(subCate => {
      const subCategory: Category = {
        categoryId: subCate.categoryId,
        categoryName: subCate.categoryName,
        parentCategory: category.categoryId,
        sellerId: sellerId,
        createdAt: new Date()
      };
      categories.push(subCategory)
    })
  })
  return categories;
}

function makeCategoriesAndSave(cates: Cate[]) {
  const categories = makeCategories(cates, sellerId);
  console.log(categories)
  db.category.bulkAdd(categories)
}

export const onMessageListener = async (e: Prettify<Event & EventAttachInfo>) => {
  const type: ApiResponseType = e.detail.type
  const url: string = e.detail.url
  let response: ApiResponse;
  if (type === 'ITEM_LIST') {
    assignCateIdUserId(url);
    response = JSON.parse(e.detail.responseText) as TBShopSimpleItemResponse;
    let items = response.data.data;
    items.forEach(item => attachDateUserIdWangWangTo(item, sellerId, wangwang))
    await checkCateIdAndUpdate(items);
  }
  if (type === 'SHOP_INFO') {
    response = JSON.parse(e.detail.responseText) as TBShopSimpleResponse;
    const shop = response.data.signInfoDTO;
    assignUserIdWangwang(shop, url);
    const cates = response.data.categoryInfoDTOList;
    makeCategoriesAndSave(cates);
    attachDateUserIdInfoTo(shop);
    db.shop.put(shop)
    let items = response.data.itemInfoDTO.data;
    items.forEach(item => attachDateUserIdWangWangTo(item, sellerId, wangwang))
    await checkCateIdAndUpdate(items);
  }
  console.log(response)
}