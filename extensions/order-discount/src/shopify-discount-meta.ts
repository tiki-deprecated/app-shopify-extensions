export interface ShopifyDiscountMeta {
    type: string;
    description: string;
    discountType: string;
    discountValue: number;
    minValue: number;
    minQty: number;
    maxUse: number;
    onePerUser: boolean;
    products: string[];
    collections: string[];
  }