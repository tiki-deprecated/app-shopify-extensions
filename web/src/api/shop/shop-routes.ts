/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { API, Throw } from '@mytiki/worker-utils-ts';
import { IRequest } from 'itty-router';
import { Shopify } from '../../shopify/shopify';

export async function index(request: IRequest, env: Env): Promise<Response> {
  let redirectUrl: string;
  const reqHeaders = request.headers;
  const reqUrl = new URL(request.url);
  const shop = request.query.shop as string;
  if (shop == null) {
    throw new API.ErrorBuilder()
      .message('Missing required parameters.')
      .detail('Requires shop.')
      .error(401);
  }
  const shopify = new Shopify(shop, env);
  try {
    const accessToken = await shopify.getToken();
    const appInstallation = await shopify.getInstall(accessToken);
    const keys = appInstallation.data!.currentAppInstallation.metafields!.nodes;
    const reqUrl = new URL(request.url);
    reqUrl.hostname = 'shopify-96o.pages.dev';
    reqUrl.pathname = '/';
    redirectUrl = reqUrl.href;
  } catch {
    reqUrl.pathname = `${API.Consts.API_LATEST}/oauth/authorize`;
    redirectUrl = reqUrl.href;
  }
  const headers = { ...reqHeaders, location: redirectUrl };
  return new Response(null, {
    status: 302,
    headers,
  });
}

export async function redact(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function uninstall(
  request: IRequest,
  env: Env
): Promise<Response> {
  const shop = request.headers.get('X-Shopify-Shop-Domain');
  Throw.ifNull(shop, 'X-Shopify-Shop-Domain');

  const shopify = new Shopify(shop as string, env);
  const success = await shopify.verifyWebhook(request);
  if (!success) {
    throw new API.ErrorBuilder().message('Invalid signature').error(403);
  }

  await shopify.removeToken();

  return new Response(null, {
    status: 200,
  });
}
