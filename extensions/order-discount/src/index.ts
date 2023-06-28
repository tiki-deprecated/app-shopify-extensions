import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Discount,
  Condition,
  TargetType,
  Target,
  OrderSubtotalTarget,
  Value,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const isDiscountAllowed = (input: InputQuery) => {
    const discountAllowed: string | undefined = input.cart.buyerIdentity?.customer?.discountAllowed?.value
    const tid: string = input.discountNode.tid!.value
    return !discountAllowed || JSON.parse(discountAllowed).indexOf(tid) === -1
}

const isAlreadyUsed = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const tid: string = input.discountNode.tid!.value
    if(  discountMeta.onePerUser ){
        const discounUsed = input.cart.buyerIdentity?.customer?.discountUsed?.value ?? '[]'
        return JSON.parse(discounUsed).indexOf(tid) === -1
    }
    return false
}

const setDiscountValue = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const discountType = discountMeta.discountType
    const discountValue: number = discountMeta.discountValue
    switch(discountType) {
        case 'percentage':
            return {
               percentage: {
                value: discountValue
            }} as Value;
        case 'amount':
            return {
               fixedAmount: {
                amount: discountValue
            }} as Value;
    }
    throw Error(`Invalid discount type ${discountType}` )
}

const setConditions = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    if(discountMeta.minValue > 0){
        return [{ 
            orderMinimumSubtotal: {
                minimumAmount: discountMeta.minValue,
                targetType: TargetType.OrderSubtotal
            },
            productMinimumQuantity: undefined,
            productMinimumSubtotal: undefined,
        } as Condition]
    }
    return []
}

export default (input: InputQuery): FunctionResult => {
    try{
        const discountMeta: ShopifyDiscountMeta = JSON.parse(input.discountNode.discount_meta!.value)
        if(!isDiscountAllowed(input) || isAlreadyUsed(input, discountMeta)){
            return EMPTY_DISCOUNT
        }
        const conditions: Array<Condition> = setConditions(input, discountMeta)
        const targets: Array<Target> = [{ orderSubtotal: { excludedVariantIds: [] } as OrderSubtotalTarget }]
        const value: Value = setDiscountValue(input, discountMeta)
        const discount: Discount = {
            conditions,
            targets,
            value
        }
        return {
            "discountApplicationStrategy": DiscountApplicationStrategy.First,
            "discounts": [discount]
        }
    }catch(e){
        console.log(e)
        return EMPTY_DISCOUNT
    }
};

export interface ShopifyDiscountMeta {
    type: string;
    description: string;
    discountType: string;
    discountValue: number;
    minValue: number;
    minQty: number;
    maxUse: number;
    onePerUser: boolean;
    products: string[];
    collections: string[];
  }