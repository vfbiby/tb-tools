import type {PlasmoCSConfig} from "plasmo"
import {useEffect} from "react";
import type {TBShopSimpleResponse} from "~src/columns/TBShopSimple";
import type {TBShopSimpleItemResponse} from "~src/columns/TBShopSimpleItem";
import {db} from "~src/lib/db";

export const config: PlasmoCSConfig = {
  matches: ["*://*.taobao.com/*"],
  world: "MAIN"
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type EventAttachInfo = {
  detail: { type: 'ITEM_LIST' | 'SHOP_INFO'; responseText: string }
};

export type ApiResponseType = 'ITEM_LIST' | 'SHOP_INFO';

export type ApiResponse = TBShopSimpleResponse | TBShopSimpleItemResponse;

const onMessageListener = async (e: Prettify<Event & EventAttachInfo>) => {
  const type: ApiResponseType = e.detail.type
  let response: ApiResponse;
  if (type === 'ITEM_LIST') {
    response = JSON.parse(e.detail.responseText) as TBShopSimpleItemResponse;
    const items = response.data.data;
    items.forEach(item => {
      item.userId = 3423424
      item.wangwang = "wangwang"
      console.log(item)
      db.item.add(item);
    })
  }
  if (type === 'SHOP_INFO') {
    response = JSON.parse(e.detail.responseText) as TBShopSimpleResponse;
    const shop = response.data.signInfoDTO;
    shop.userId = 3234
    db.shop.add(shop)
  }
  console.log(response.api)
}

const TestPage = () => {

  useEffect(() => {
    window.addEventListener("FROM_INJECTED", onMessageListener, false)
    return () => {
      window.removeEventListener("FROM_INJECTED", onMessageListener)
    }
  }, [])

  return <div style={{top: '220px', left: '20px', position: 'relative'}}>
    <button style={{padding: "2px 4px"}}>show</button>
  </div>
}

export default TestPage