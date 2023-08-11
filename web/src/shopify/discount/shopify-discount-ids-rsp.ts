/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyNodes } from '../meta/shopify-nodes';
import { ShopifyDiscountNode } from './shopify-discount-node';

export interface ShopifyDiscountIdsRsp {
  discountNodes: ShopifyNodes<ShopifyDiscountNode>;
}
