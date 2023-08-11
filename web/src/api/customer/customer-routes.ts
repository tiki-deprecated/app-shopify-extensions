/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { Shopify } from '../../shopify/shopify';
import { CustomerDiscount } from './customer-discount';
import { API, Throw } from '@mytiki/worker-utils-ts';
import { Tiki } from '../../tiki/tiki';

export async function dataRequest(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function redact(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function discount(request: IRequest, env: Env): Promise<Response> {
  const token = request.headers.get(API.Consts.AUTHORIZATION) as string;
  const address = request.headers.get('X-Tiki-Address') as string;
  const signature = request.headers.get('X-Tiki-Signature') as string;

  Throw.ifNull(token, 'Authorization');
  Throw.ifNull(address, 'X-Tiki-Address');
  Throw.ifNull(signature, 'X-Tiki-Signature');

  const tiki = new Tiki(env);
  // const claims = await tiki.verifyEcdsa(token.replace('Bearer ', ''));
  // const appId = claims.get('sub') as string;
  // const pubKey = await tiki.pubkey(address, appId);
  const body = await request.text();
  // const validSig = await tiki.verifyRsa(pubKey, signature as string, body);
  // if (!validSig) {
  //   throw new API.ErrorBuilder().message('Invalid X-Tiki-Signature').error(403);
  // }
  const json: CustomerDiscount = JSON.parse(body);
    const adminToken = await tiki.admin();
    const registry = await tiki.registry(adminToken, address, appId);
    if (Number(registry.id) !== json.customerId) {
      throw new API.ErrorBuilder().message('Invalid X-Tiki-Address').error(403);
    }

  const shopify = new Shopify(json.shop, env);
  await shopify.setDiscountAllowed(json.customerId, json.discountId);
  return new Response(null, {
    status: 201,
  });
}
