/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface OrderReq {
  customer: {
    id: number;
  };
  discount_applications: Array<{
    type: string;
    title: string;
    description: string;
    value: string;
    value_type: string;
    allocation_method: string;
    target_selection: string;
    target_type: string;
  }>;
}
