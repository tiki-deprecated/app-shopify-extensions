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
    console.log(`discountAllowed ${discountAllowed}`);
    const tid: string = input.discountNode.tid!.value
    console.log(`tid ${tid}`);
    console.log(discountAllowed);
    console.log(JSON.parse(discountAllowed!).indexOf(tid));
    return JSON.parse(discountAllowed).indexOf(tid) !== -1
}

const isAlreadyUsed = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const tid: string = input.discountNode.tid!.value
    console.log(`tid ${tid}`);
    if(  discountMeta.onePerUser ){
        const discounUsed = input.cart.buyerIdentity?.customer?.discountUsed?.value ?? '[]'
        console.log(`discountUsed ${discounUsed}`);
        return JSON.parse(discounUsed).indexOf(tid) !== -1
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
        console.log(JSON.stringify(discountMeta));
        if(!isDiscountAllowed(input) || isAlreadyUsed(input, discountMeta)){
            return EMPTY_DISCOUNT
        }
        console.log('conditions');
        const conditions: Array<Condition> = setConditions(input, discountMeta)
        console.log('targets');
        const targets: Array<Target> = [{ orderSubtotal: { excludedVariantIds: [] } as OrderSubtotalTarget }]
        console.log('value');
        const value: Value = setDiscountValue(input, discountMeta)
        console.log('discount');
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
