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
import { ShopifyDiscountMeta } from "./shopify-discount-meta";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const isDiscountAllowed = (input: InputQuery) => {
    const discountAllowed: string | undefined = input.cart.buyerIdentity?.customer?.discountAllowed?.value
    if(discountAllowed === undefined){
        return false;
    }
    const discountAllowedList: Array<string> = JSON.parse(discountAllowed)
    if( discountAllowedList.length === 0 ){
        return false;
    }
    const tid: string = input.discountNode.tid!.value
    return JSON.parse(discountAllowed).indexOf(tid) !== -1
}

const isAlreadyUsed = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const tid: string = input.discountNode.tid!.value
    if ( discountMeta.onePerUser ){
        const discountUsed = input.cart.buyerIdentity?.customer?.discountUsed?.value ?? '[]'
        return JSON.parse(discountUsed).indexOf(tid) !== -1
    }
    return false
}

const setDiscountValue = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const discountType = discountMeta.discountType
    const discountValue: number = discountMeta.discountValue
    switch(discountType) {
        case 'percent':
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
    const minQty: number = Number(discountMeta.minQty)
    const minValue: number = Number(discountMeta.minValue)
    for(let line of input.cart.lines){
       if(
        line.quantity! <= minQty ||
        input.cart?.cost?.subtotalAmount?.amount <= minValue
        ){
            throw Error ('Error in Min Value/Min Discount')
        }
    }
     return [{ 
        orderMinimumSubtotal: {
            minimumAmount: minValue,
            targetType: TargetType.OrderSubtotal,
            excludedVariantIds: []
        },
        productMinimumQuantity: undefined,
        productMinimumSubtotal: undefined,
    } as Condition]
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
        return EMPTY_DISCOUNT
    }
};
