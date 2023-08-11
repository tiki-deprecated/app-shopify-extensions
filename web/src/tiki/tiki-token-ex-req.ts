/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface TikiTokenExReq extends Record<string, string> {
  grant_type: string;
  client_id: string;
  subject_token: string;
  subject_token_type: string;
  scope: string;
}
