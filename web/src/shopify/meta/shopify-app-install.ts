/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyNodes } from './shopify-nodes';
import { ShopifyMetafield } from './shopify-metafield';

export interface ShopifyAppInstall {
  id: string;
  launchUrl: string;
  metafields?: ShopifyNodes<ShopifyMetafield>;
}
