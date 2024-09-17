import type {PlasmoCSConfig} from "plasmo"
import {useEffect} from "react";
import type {TBShopSimpleResponse} from "~src/columns/TBShopSimple";
import type {TBShopSimpleItemResponse} from "~src/columns/TBShopSimpleItem";
import {onMessageListener} from "~src/lib/utils";

export const config: PlasmoCSConfig = {
  matches: ["*://*.taobao.com/*"],
  world: "MAIN"
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type EventAttachInfo = {
  detail: { type: 'ITEM_LIST' | 'SHOP_INFO'; responseText: string; url: string }
};

export type ApiResponseType = 'ITEM_LIST' | 'SHOP_INFO';

export type ApiResponse = TBShopSimpleResponse | TBShopSimpleItemResponse;

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