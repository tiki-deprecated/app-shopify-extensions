/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyAuth } from '../auth/shopify-auth';
import { ShopifyData } from './shopify-data';
import { ShopifyCustomerRsp } from './shopify-customer-rsp';
import { API } from '@mytiki/worker-utils-ts';
import { TikiKeyCreateRsp } from '../../tiki/tiki-key-create-rsp';
import { ShopifyMetafield } from './shopify-metafield';
import { ShopifyAppInstallRsp } from './shopify-app-install-rsp';
import { ShopifyWebhook } from '../webhook/shopify-webhook';
import { query, mutation } from 'gql-query-builder';

export type {
  ShopifyData,
  ShopifyAppInstallRsp,
  ShopifyCustomerRsp,
  ShopifyMetafield,
};

export class ShopifyMeta extends ShopifyWebhook {
  static readonly namespace = 'mytiki';

  async setMetafields(fields: Array<ShopifyMetafield>): Promise<void> {
    const accessToken = await this.getToken();
    await fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(
        mutation(
          {
            operation: 'metafieldsSet',
            variables: {
              metafields: {
                value: fields,
                type: 'MetafieldsSetInput!',
                required: true,
                list: true,
              },
            },
            fields: [
              {
                metafields: [
                  'key',
                  'namespace',
                  'value',
                  'createdAt',
                  'updatedAt',
                ],
              },
              {
                userErrors: ['field', 'message'],
              },
            ],
          },
          undefined,
          {
            operationName: 'MetafieldsSet',
          }
        )
      ),
    });
  }

  async getCustomerMetafield(
    id: number,
    key: string
  ): Promise<ShopifyData<ShopifyCustomerRsp>> {
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(
        query(
          {
            operation: 'customer',
            variables: {
              id: {
                value: `gid://shopify/Customer/${id}`,
                type: 'ID',
                required: true,
              },
            },
            fields: [
              {
                operation: 'metafield',
                variables: {
                  key: {
                    value: key,
                    type: 'String',
                    required: true,
                  },
                  namespace: {
                    value: ShopifyMeta.namespace,
                    type: 'String',
                  },
                },
                fields: ['value'],
              },
            ],
          },
          undefined,
          {
            operationName: 'Customer',
          }
        )
      ),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyCustomerRsp>);
  }

  saveKeys = async (
    appId: string,
    publicKey: TikiKeyCreateRsp,
    privateKey: TikiKeyCreateRsp
  ): Promise<void> =>
    this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key: 'public_key_id',
        type: 'single_line_text_field',
        value: publicKey.id,
        ownerId: appId,
      },
      {
        namespace: ShopifyMeta.namespace,
        key: 'private_key_id',
        type: 'single_line_text_field',
        value: privateKey.id,
        ownerId: appId,
      },
      {
        namespace: ShopifyMeta.namespace,
        key: 'private_key_secret',
        type: 'single_line_text_field',
        value: privateKey.secret ?? '',
        ownerId: appId,
      },
    ]);

  async getInstall(
    accessToken: string
  ): Promise<ShopifyData<ShopifyAppInstallRsp>> {
    const gql = query({
      operation: 'currentAppInstallation',
      fields: [
        'id',
        'launchUrl',
        {
          operation: 'metafields',
          variables: {
            namespace: { type: 'String', value: ShopifyMeta.namespace },
            first: { type: 'Int', value: 3 },
          },
          fields: [
            {
              nodes: ['key', 'value'],
            },
          ],
        },
      ],
    });
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(gql),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyAppInstallRsp>);
  }
}
