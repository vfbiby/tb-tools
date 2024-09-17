type Category = {
  userId: string;
  categoryId: number;
  categoryName: string;
  parentCategory?: number;
  createdAt: Date;
}

export type Cate = {
  "categoryId": number;
  "categoryName": string;
  "customDecorate": boolean;
  "subCategoryInfoList": Cate[]
};

export type Item = {
  "shop": ShopDTO;
  "cateId": string;
  "createdAt": Date;
  "wangwang": string;
  "userId": string;
  "image": string;
  "itemId": string;
  "title": string;
  "itemUrl": string;
  "discountPrice": string;
  "priceEncoded": boolean;
  "benefitPointData": string[],
  "vagueSold365": string;
};

export type ShopDTO = {
  createdAt: Date;
  "userId": string;
  "shopLogoUrl": string;
  "shopName": string;
  "bailIconUrl": string;
  "bailAmount": string;
  "personalManager": boolean;
  "shopStatement": string;
  "ownerChanged": false,
  "ownerChangePublicityUrl": string;
  "shopUrl": string;
  "businessIconUrl": string;
  "rankIconUrl": string;
  "fansNum": string;
  "wangwang": string;
  "evaluateList": [
    {
      "score": string;
      "title": string;
      "type": string;
      "peerComparisonInfo": string;
      "starPic": string;
    },
    {
      "level": string;
      "score": string;
      "title": string;
      "type": string;
    },
    {
      "level": string;
      "score": string;
      "title": string;
      "type": string;
    },
    {
      "level": string;
      "score": string;
      "title": string;
      "type": string;
    }
  ],
  "endorseInfo": {
    "backgroundColor": string;
    "icon": string;
    "text": string;
    "textColor": string;
  },
  "shopTagList": string[];
  "followed": boolean;
};

export type TBShopSimple = {
  "globalInfoDTO": {
    "logoUrl": string;
    "logoJumpUrl": string;
    "globalSearchUrl": string;
    "hotSearchWordList": string[ ],
    "inLive": boolean;
    "riskFlow": boolean;
    "buyerNick": string;
    "hasLogin": boolean;
    "b2CShop": boolean;
  },
  "signInfoDTO": ShopDTO,
  "rightsInfoDTO": {
    "hasMemberCenter": true,
    "member": false,
    "buyerAvatarUrl": string;
  },
  "categoryInfoDTOList": Cate[],
  "itemInfoDTO": {
    "totalCnt": number;
    "data": Item[],
    "page": number;
    "pageSize": number;
    "hasNext": boolean;
  }
}

type TBShopSimpleResponse = {
  "api": string;
  "v": string;
  "ret": string[ ],
  "data": TBShopSimple;
  "traceId": string;
}