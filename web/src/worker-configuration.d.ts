/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

interface Env {
  KEY_ID: string;
  KEY_SECRET: string;
  KV_STORE: KVNamespace;

  FUNCTION_ID_ORDER_DISCOUNT: string;
  FUNCTION_ID_PRODUCT_DISCOUNT: string;

  ADMIN_ID: string;
  ADMIN_SECRET: string;

  JWK: string;
}
