/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

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
