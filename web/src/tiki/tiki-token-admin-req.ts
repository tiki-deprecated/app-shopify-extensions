/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface TikiTokenAdminReq extends Record<string, string> {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
}
