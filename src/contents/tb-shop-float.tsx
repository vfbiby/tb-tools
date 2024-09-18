import {Drawer} from "@mui/material";
import type {PlasmoCSConfig} from "plasmo"
import React, {useEffect, useState} from "react";
import type {TBShopSimpleResponse} from "~src/columns/TBShopSimple";
import type {TBShopSimpleItemResponse} from "~src/columns/TBShopSimpleItem";
import {onMessageListener} from "~src/lib/utils";
import {ItemListTable} from "~src/components/item-list-table";
import {LicenseInfo} from "@mui/x-license-pro";

export const config: PlasmoCSConfig = {
  matches: ["*://*.taobao.com/*"],
  // world: "MAIN"
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type EventAttachInfo = {
  detail: { type: 'ITEM_LIST' | 'SHOP_INFO'; responseText: string; url: string }
};

export type ApiResponseType = 'ITEM_LIST' | 'SHOP_INFO';

export type ApiResponse = TBShopSimpleResponse | TBShopSimpleItemResponse;

window.addEventListener("FROM_INJECTED", onMessageListener, false)
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

const TestPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    window.addEventListener("FROM_INJECTED", onMessageListener, false)
    return () => {
      window.removeEventListener("FROM_INJECTED", onMessageListener)
    }
  }, [])

  return <div style={{top: '220px', left: '20px', position: 'fixed'}}>
    {!drawerOpen && <button onClick={() => setDrawerOpen(true)} style={{padding: "2px 4px"}}>show</button>}
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {width: "100%", height: "80%"}
      }}
    >
      <ItemListTable/>
    </Drawer>
  </div>
}

export default TestPage