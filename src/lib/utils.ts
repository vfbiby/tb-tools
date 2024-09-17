import type {Item, ShopDTO, TBShopSimpleResponse} from "~src/columns/TBShopSimple";
import type {TBShopSimpleItemResponse} from "~src/columns/TBShopSimpleItem";
import {db} from "~src/lib/db";
import {type ApiResponse, type ApiResponseType, type EventAttachInfo, type Prettify} from "~src/contents/tb-shop-float";

function attachDateUserIdWangWangTo(item: Item, userId: number, wangwang: string) {
  if (!userId || !wangwang) throw new Error('userId or wang can not be null!')
  item.userId = userId
  item.wangwang = wangwang
  item.createdAt = new Date()
}

export let wangwang: string;
export let userId: number;

function attachDateUserIdInfoTo(shop: ShopDTO) {
  if (!userId) throw new Error('userId can not be null!')
  shop.userId = userId
  shop.createdAt = new Date()
}

function assignUserIdWangwang(shop: ShopDTO) {
  if (!shop.shopUrl || !shop.wangwang)
    throw new Error(`shop dto has no shopUrl ${shop.shopUrl} or wangwang ${shop.wangwang}!`)
  userId = parseInt(shop.shopUrl.match(/user_id=(\d+)/)[1])
  wangwang = shop.wangwang
}

export const onMessageListener = async (e: Prettify<Event & EventAttachInfo>) => {
  const type: ApiResponseType = e.detail.type
  console.log(type)
  let response: ApiResponse;
  if (type === 'ITEM_LIST') {
    response = JSON.parse(e.detail.responseText) as TBShopSimpleItemResponse;
    const items = response.data.data;
    items.forEach(item => attachDateUserIdWangWangTo(item, userId, wangwang))
    db.item.bulkPut(items);
  }
  if (type === 'SHOP_INFO') {
    response = JSON.parse(e.detail.responseText) as TBShopSimpleResponse;
    const shop = response.data.signInfoDTO;
    assignUserIdWangwang(shop);
    const items = response.data.itemInfoDTO.data;
    items.forEach(item => attachDateUserIdWangWangTo(item, userId, wangwang))
    db.item.bulkPut(items)
    attachDateUserIdInfoTo(shop);
    userId && db.shop.put(shop)
  }
  console.log(response)
}