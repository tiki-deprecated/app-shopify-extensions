/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface TikiLicenseRsp {
  approxResults: number;
  nextPageToken?: string;
  results: Array<{
    id: string;
    ptr: string;
    tags: Array<string>;
    uses: Array<{
      usecases: Array<string>;
      destinations: Array<string>;
    }>;
  }>;
}
