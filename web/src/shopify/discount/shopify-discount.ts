/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReq } from '../../api/discount/discount-req';
import { ShopifyMeta } from '../meta/shopify-meta';
import { API } from '@mytiki/worker-utils-ts';
import * as UUID from 'uuid';
import { ShopifyAuth } from '../auth/shopify-auth';
import { ShopifyDiscountCreate } from './shopify-discount-create';
import { ShopifyData } from '../meta/shopify-data';
import { ShopifyDiscountIdsRsp } from './shopify-discount-ids-rsp';
import { ShopifyDiscountIdRsp } from './shopify-discount-id-rsp';
import { ShopifyDiscountMeta } from './shopify-discount-meta';
import { query, mutation } from 'gql-query-builder';

export type { ShopifyDiscountIdsRsp };

export class ShopifyDiscount extends ShopifyMeta {
  private readonly _functionIdOrder: string;
  private readonly _functionIdProduct: string;

  constructor(shopDomain: string, env: Env) {
    super(shopDomain, env);
    this._functionIdOrder = env.FUNCTION_ID_ORDER_DISCOUNT;
    this._functionIdProduct = env.FUNCTION_ID_PRODUCT_DISCOUNT;
  }

  async createDiscount(discount: DiscountReq, appId: string): Promise<string> {
    const id = UUID.v4();
    const accessToken = await this.getToken();
    const req: ShopifyDiscountCreate = {
      combinesWith: {
        orderDiscounts: discount.combinesWith.orderDiscounts,
        productDiscounts: discount.combinesWith.productDiscounts,
        shippingDiscounts: discount.combinesWith.shippingDiscounts,
      },
      description: discount.description,
      endsAt: discount.endsAt,
      functionId:
        discount.metafields.type === 'order'
          ? this._functionIdOrder
          : this._functionIdProduct,
      metafields: [
        {
          key: 'tid',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: id,
        },
        {
          key: 'discount_meta',
          namespace: ShopifyMeta.namespace,
          type: 'json',
          value: JSON.stringify(discount.metafields),
        },
        {
          key: 'products',
          namespace: ShopifyMeta.namespace,
          type: 'json',
          value: JSON.stringify(discount.metafields.products),
        },
        {
          key: 'collections',
          namespace: ShopifyMeta.namespace,
          type: 'json',
          value: JSON.stringify(discount.metafields.collections),
        },
      ],
      startsAt: discount.startsAt,
      title: discount.title,
    };
    const mutationQuery = mutation(
      {
        operation: 'discountAutomaticAppCreate',
        variables: {
          automaticAppDiscount: {
            value: req,
            type: 'DiscountAutomaticAppInput',
            required: true,
          },
        },
        fields: [
          {
            userErrors: ['message', 'field'],
          },
        ],
      },
      undefined,
      {
        operationName: 'DiscountAutomaticAppCreate',
      }
    );
    return JSON.stringify(mutationQuery);
    const res = await fetch(
      `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
      {
        method: 'POST',
        headers: new API.HeaderBuilder()
          .accept(API.Consts.APPLICATION_JSON)
          .content(API.Consts.APPLICATION_JSON)
          .set(ShopifyAuth.tokenHeader, accessToken)
          .build(),
        body: JSON.stringify(mutationQuery),
      }
    );
    if (res.status !== 200) {
      const body = await res.text();
      throw new API.ErrorBuilder()
        .message(res.statusText)
        .detail(body)
        .error(res.status);
    } else {
      await this.setMetafields([
        {
          namespace: ShopifyMeta.namespace,
          key: 'discount',
          type: 'json',
          value: JSON.stringify({
            amount: discount.metafields.discountValue,
            type: discount.metafields.discountType,
            description: discount.description,
            expiry: discount.endsAt,
            reference: id,
          }),
          ownerId: appId,
        },
      ]);
      return id;
    }
  }

  async setDiscountAllowed(customer: number, id: string): Promise<void> {
    const key = 'discount_allowed';
    const cur = await this.getCustomerMetafield(customer, key);
    const allowedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    allowedList.push(id);
    await this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key,
        type: 'list.single_line_text_field',
        value: JSON.stringify(allowedList),
        ownerId: `gid://shopify/Customer/${customer}`,
      },
    ]);
  }

  async getDiscountIds(
    titles: Array<string>
  ): Promise<ShopifyData<ShopifyDiscountIdsRsp>> {
    const filter = `title:${titles.map((title) => `"${title}"`).join(' OR ')}`;
    const accessToken = await this.getToken();
    const gql = query(
      {
        operation: 'discountNodes',
        variables: {
          query: {
            value: filter,
            type: 'String',
          },
          reverse: {
            value: true,
            type: 'Boolean',
          },
          sortKey: {
            value: 'CREATED_AT',
            type: 'DiscountSortKeys',
          },
          first: {
            value: titles.length * 2,
            type: 'Int',
          },
        },
        fields: [
          {
            nodes: [
              {
                operation: 'metafield',
                variables: {
                  key: { value: 'tid', type: 'String', required: true },
                  namespace: {
                    value: ShopifyMeta.namespace,
                    type: 'String',
                  },
                },
                fields: ['key', 'value'],
              },
            ],
          },
        ],
      },
      undefined,
      {
        operationName: 'DiscountNodes',
      }
    );
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
      .then((json) => json as ShopifyData<ShopifyDiscountIdsRsp>);
  }

  async getDiscountById(id: string): Promise<Response> {
    const accessToken = await this.getToken();
    const discountId = `gid://shopify/DiscountNode/${id}`;
    const gql = query({
      operation: 'discountNode',
      variables: {
        id: {
          value: discountId,
          type: 'ID!',
        },
      },
      fields: [
        {
          operation: 'metafield',
          variables: {
            key: { value: 'discount-meta', type: 'String', required: true },
            namespace: {
              value: ShopifyMeta.namespace,
              type: 'String',
            },
          },
          fields: ['value'],
        },
        {
          operation: 'discount',
          variables: {},
          fields: [
            {
              operation: 'DiscountAutomaticApp',
              fields: [
                'title',
                {
                  operation: 'combinesWith',
                  fields: [
                    'orderDiscounts',
                    'productDiscounts',
                    'shippingDiscounts',
                  ],
                  variables: {},
                },
                'startsAt',
                'endsAt',
              ],
              variables: {},
              fragment: true,
            },
          ],
        },
      ],
    });
    const response = await fetch(
      `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
      {
        method: 'POST',
        headers: new API.HeaderBuilder()
          .accept(API.Consts.APPLICATION_JSON)
          .content(API.Consts.APPLICATION_JSON)
          .set(ShopifyAuth.tokenHeader, accessToken)
          .build(),
        body: JSON.stringify(gql),
      }
    );
    const discountIdResp: ShopifyData<ShopifyDiscountIdRsp> =
      await response.json();
    console.log(JSON.stringify(discountIdResp));
    if (
      discountIdResp.data.discountNode.discount &&
      discountIdResp.data.discountNode.metafield
    ) {
      const discountMeta: ShopifyDiscountMeta = JSON.parse(
        discountIdResp.data.discountNode.metafield.value
      );
      const discountData = discountIdResp.data.discountNode.discount;
      const discount = {
        title: discountData.title,
        startsAt: new Date(discountData.startsAt),
        endsAt: discountData.endsAt ? new Date(discountData.endsAt) : undefined,
        metafields: {
          type: discountMeta.type,
          description: discountMeta.description,
          discountType: discountMeta.discountType,
          discountValue: discountMeta.discountValue,
          minValue: discountMeta.minValue,
          minQty: discountMeta.minQty,
          maxUse: discountMeta.maxUse,
          onePerUser: discountMeta.onePerUser,
          products: discountMeta.products,
          collections: discountMeta.collections,
        },
        combinesWith: discountData.combinesWith,
      };
      return new Response(JSON.stringify(discount));
    }
    return new Response('not found', { status: 404 });
  }

  async discountUsed(customer: number, id: Array<string>): Promise<void> {
    const key = 'discount_applied';
    const cur = await this.getCustomerMetafield(customer, key);
    const appliedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    await this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key,
        type: 'list.single_line_text_field',
        value: JSON.stringify(appliedList.concat(id)),
        ownerId: `gid://shopify/Customer/${customer}`,
      },
    ]);
  }
}
