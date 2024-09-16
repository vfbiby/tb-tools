import type {Item} from "~src/columns/TBShopSimple";

export type TBShopSimpleItem = {
  "totalCnt": number;
  "data": Item[],
  "page": number;
  "pageSize": number;
}
