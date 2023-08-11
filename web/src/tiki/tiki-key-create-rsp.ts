/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface TikiKeyCreateRsp {
  id: string;
  created: string;
  isPublic: boolean;
  secret?: string;
}
