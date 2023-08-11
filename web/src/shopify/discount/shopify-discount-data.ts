/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyDiscountCombine } from './shopify-discount-combine';

export interface ShopifyDiscountData {
  title: string;
  startsAt: Date;
  endsAt?: Date;
  combinesWith: ShopifyDiscountCombine;
}
