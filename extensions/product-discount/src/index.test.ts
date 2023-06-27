import { describe, it, expect } from 'vitest';
import productDiscounts from './index';
import { FunctionResult, DiscountApplicationStrategy } from '../generated/api';

describe('product discounts function', () => {
  it('returns no discounts without configuration', () => {
    const result = productDiscounts({
      discountNode: {
        metafield: null
      }
    });
    const expected: FunctionResult = {
      discounts: [],
      discountApplicationStrategy: DiscountApplicationStrategy.First,
    };

    expect(result).toEqual(expected);
  });
});