/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import * as Verify from './__fixtures__/verify';
import { Shopify } from '../shopify/shopify';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const env = getMiniflareBindings() as Env;

describe('Shopify Verification Tests', function () {
  test('Verify Webhook', async () => {
    const shopify = new Shopify('dummy', env);
    const signature = await Verify.signedHeader();
    const request = new Request('https://shopify-test.mytiki.com', {
      method: 'POST',
      body: Verify.webhook,
      headers: new Headers({
        'X-Shopify-Hmac-SHA256': signature,
      }),
    });
    const success = await shopify.verifyWebhook(request);
    expect(success);
  });

  test('Verify OAuth', async () => {
    const shopify = new Shopify('dummy', env);
    const signedQuery = await Verify.signedQuery();
    const request = new Request(
      `https://shopify-test.mytiki.com/?${signedQuery}`
    );
    const success = await shopify.verifyOAuth(request);
    expect(success);
  });

  test('Verify JWT', async () => {
    const shopify = new Shopify(Verify.claims.dest, env);
    const claims = await shopify.verifySession(Verify.jwt);
    expect(claims.dest === Verify.claims.dest);
    expect(claims.iss === Verify.claims.iss);
    expect(claims.aud === Verify.claims.aud);
    expect(claims.exp?.getTime() === Verify.claims.exp * 1000);
    expect(claims.nbf?.getTime() === Verify.claims.nbf * 1000);
    expect(claims.sub === Verify.claims.sub);
  });
});
