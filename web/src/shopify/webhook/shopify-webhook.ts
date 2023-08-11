/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyAuth } from '../auth/shopify-auth';
import { API } from '@mytiki/worker-utils-ts';
import { ShopifyWebhookReq } from './shopify-webhook-req';
import { ShopifyWebhookReqWebhook } from './shopify-webhook-req-webhook';

export type { ShopifyWebhookReq, ShopifyWebhookReqWebhook };

export class ShopifyWebhook extends ShopifyAuth {
  async registerWebhook(webhook: ShopifyWebhookReq): Promise<void> {
    const accessToken = await this.getToken();
    await fetch(`https://${this.shopDomain}/admin/api/2023-04/webhooks.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(webhook),
    });
  }

  registerOrderPaidWebhook = (baseUrl: string): Promise<void> =>
    this.registerWebhook({
      webhook: {
        address: `https://${baseUrl}/api/latest/order/paid`,
        topic: 'orders/paid',
        format: 'json',
      },
    });

  registerUninstallWebhook = (baseUrl: string): Promise<void> =>
    this.registerWebhook({
      webhook: {
        address: `https://${baseUrl}/api/latest/shop/uninstall`,
        topic: 'app/uninstalled',
        format: 'json',
      },
    });
}
