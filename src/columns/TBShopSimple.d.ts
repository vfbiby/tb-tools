export type Category = {
  "categoryId": number;
  "categoryName": string;
  "customDecorate": boolean;
  "subCategoryInfoList": Category[]
};

export type Item = {
  "image": string;
  "itemId": 762412927120,
  "title": string;
  "itemUrl": string;
  "discountPrice": string;
  "priceEncoded": boolean;
  "benefitPointData": string[],
  "vagueSold365": string;
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
  "signInfoDTO": {
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
  },
  "rightsInfoDTO": {
    "hasMemberCenter": true,
    "member": false,
    "buyerAvatarUrl": string;
  },
  "categoryInfoDTOList": Category[],
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