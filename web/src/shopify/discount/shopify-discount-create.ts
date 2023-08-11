/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyMetafield } from '../meta/shopify-metafield';
import { ShopifyDiscountCombine } from './shopify-discount-combine';

export interface ShopifyDiscountCreate {
  combinesWith: ShopifyDiscountCombine;
  description: string;
  endsAt?: Date;
  functionId: string;
  metafields: Array<ShopifyMetafield>;
  startsAt: Date;
  title: string;
}
