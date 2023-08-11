/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyMetafield } from '../meta/shopify-metafield';
import { ShopifyDiscountData } from './shopify-discount-data';

export interface ShopifyDiscountNode {
  id?: string;
  metafield?: ShopifyMetafield;
  discount?: ShopifyDiscountData;
}
