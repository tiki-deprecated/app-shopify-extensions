/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface ShopifyJwt {
  exp?: Date;
  nbf?: Date;
  iss?: string;
  dest?: string;
  aud?: string;
  sub?: string;
}
