/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface ShopifyWebhookReqWebhook {
  address: string;
  topic: string;
  format: 'json' | 'xml';
}
