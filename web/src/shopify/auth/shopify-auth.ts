/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyJwt } from './shopify-jwt';
import { ShopifyTokenRsp } from './shopify-token-rsp';
import { API, JWT } from '@mytiki/worker-utils-ts';

export type { ShopifyJwt };

export class ShopifyAuth {
  static readonly tokenHeader = 'X-Shopify-Access-Token';
  static readonly signHeader = 'X-Shopify-Hmac-SHA256';
  static readonly scope =
    'read_orders,write_discounts,read_customers,write_customers';

  private _accessToken: string | null = null;
  private readonly _keyId: string;
  private readonly _secretKey: string;
  private readonly _tokenStore: KVNamespace;
  readonly shopDomain: string;

  constructor(shopDomain: string, env: Env) {
    this.shopDomain = shopDomain;
    this._keyId = env.KEY_ID;
    this._secretKey = env.KEY_SECRET;
    this._tokenStore = env.KV_STORE;
  }

  authorize = (redirectUri: string): string =>
    `https://${this.shopDomain}/admin/oauth/authorize?` +
    `client_id=${this._keyId}&` +
    `scope=${ShopifyAuth.scope}&` +
    `redirect_uri=${redirectUri}`;

  async grant(code: string): Promise<string> {
    const url =
      `https://${this.shopDomain}/admin/oauth/access_token?` +
      `client_id=${this._keyId}&` +
      `client_secret=${this._secretKey}&` +
      `code=${code}`;
    console.log(url);
    const tokenRsp = await fetch(url, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .content(API.Consts.APPLICATION_JSON)
        .accept(API.Consts.APPLICATION_JSON)
        .build(),
    });
    const jsonRsp = await tokenRsp.json();
    const token = (jsonRsp as ShopifyTokenRsp).access_token;
    await this._tokenStore.put(this.shopDomain, token);
    return token;
  }

  async getToken(): Promise<string> {
    if (this._accessToken == null) {
      this._accessToken = await this._tokenStore.get(this.shopDomain);
    }
    if (this._accessToken == null) {
      throw new API.ErrorBuilder()
        .message('Invalid access token')
        .help('Try /api/latest/oauth/authorize')
        .error(403);
    }
    return this._accessToken;
  }

  async removeToken(): Promise<void> {
    await this._tokenStore.delete(this.shopDomain);
  }

  async verifyWebhook(request: Request): Promise<boolean> {
    const req = request.clone();
    const signature = req.headers.get(ShopifyAuth.signHeader) ?? '';
    const signatureBytes = Uint8Array.from(atob(signature), (c) =>
      c.charCodeAt(0)
    );
    const body = await req.text();
    return this.verify(signatureBytes, new TextEncoder().encode(body));
  }

  async verifyOAuth(request: Request): Promise<boolean> {
    const url = new URL(request.url);
    const params = url.searchParams;
    const signature = params.get('hmac') ?? '';
    params.delete('hmac');
    params.sort();
    const match = signature.match(/.{1,2}/g);
    if (match == null) return false;
    const signatureBytes = Uint8Array.from(
      match.map((byte) => parseInt(byte, 16))
    );

    return this.verify(
      signatureBytes,
      new TextEncoder().encode(params.toString())
    );
  }

  verifySession = async (jwt: string): Promise<ShopifyJwt> =>
    ShopifyAuth.verifySession(jwt, this._keyId, this._secretKey);

  static async verifySession(
    jwt: string,
    id: string,
    secret: string
  ): Promise<ShopifyJwt> {
    const alg = {
      name: 'HMAC',
      hash: 'SHA-256',
    };
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      alg,
      false,
      ['verify']
    );
    const claims = await JWT.decode(jwt, key, {
      algorithm: alg,
      claims: ['dest', 'iss', 'aud', 'exp'],
      aud: [id],
      clockSkew: 60,
    });
    return {
      iss: claims.get('iss') as string,
      sub: claims.get('sub') as string,
      dest: claims.get('dest') as string,
      nbf: new Date((claims.get('nbf') as number) * 1000),
      exp: new Date((claims.get('exp') as number) * 1000),
      aud: claims.get('aud') as string,
    };
  }

  private async verify(
    signature: ArrayBuffer,
    data: ArrayBuffer
  ): Promise<boolean> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this._secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
  }
}
