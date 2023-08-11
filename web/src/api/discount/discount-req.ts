/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReqCombine } from './discount-req-combine';
import { DiscountReqMeta } from './discount-req-meta';

export interface DiscountReq {
  title: string;
  description: string;
  startsAt: Date;
  endsAt?: Date;
  combinesWith: DiscountReqCombine;
  metafields: DiscountReqMeta;
}
