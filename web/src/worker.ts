/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import * as OAuth from './api/oauth/oauth-routes';
import * as Order from './api/order/order-routes';
import * as Customer from './api/customer/customer-routes';
import * as Shop from './api/shop/shop-routes';
import * as Discount from './api/discount/discount-routes';
import { API } from '@mytiki/worker-utils-ts';
import { Router, error, createCors, StatusError } from 'itty-router';

const { preflight, corsify } = createCors({
  methods: ['GET', 'POST'],
  origins: ['*'],
});
const router = Router();
router
  .all('*', preflight)
  .get('/', Shop.index)
  .get(`${API.Consts.API_LATEST}/oauth/authorize`, OAuth.authorize)
  .get(`${API.Consts.API_LATEST}/oauth/token`, OAuth.token)
  .post(`${API.Consts.API_LATEST}/order/paid`, Order.paid)
  .post(`${API.Consts.API_LATEST}/customer/data-request`, Customer.dataRequest)
  .post(`${API.Consts.API_LATEST}/customer/redact`, Customer.redact)
  .post(`${API.Consts.API_LATEST}/customer/discount`, Customer.discount)
  .post(`${API.Consts.API_LATEST}/shop/redact`, Shop.redact)
  .get(`${API.Consts.API_LATEST}/shop/uninstall`, Shop.uninstall)
  .post(`${API.Consts.API_LATEST}/discount`, Discount.create)
  .get(`${API.Consts.API_LATEST}/discount/:id`, Discount.get)
  .all('*', () => new API.ErrorBuilder().message('Not Found').error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return await router
      .handle(request, env, ctx)
      .catch((err) => {
        let detail = 'Something went wrong';
        if (err instanceof Response) return err;
        if (err instanceof StatusError) return error(err);
        if (err instanceof Error) detail = err.message;
        return new API.ErrorBuilder()
          .message('Uh Oh')
          .detail(detail)
          .error(500);
      })
      .then(corsify);
  },
};
