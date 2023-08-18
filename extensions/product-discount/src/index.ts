import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Discount,
  Target,
  Value,
  ProductVariant,
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
    if(  discountMeta.onePerUser ){
        const discounUsed = input.cart.buyerIdentity?.customer?.discountUsed?.value ?? '[]'
        return JSON.parse(discounUsed).indexOf(tid) !== -1
    }
    return false
}

const setDiscountValue = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    const discountType = discountMeta.discountType
    const discountValue: number = Number(discountMeta.discountValue)
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

const setTargets = (input: InputQuery, discountMeta: ShopifyDiscountMeta) => {
    let targets: Target[] = []
    const products: string[] = JSON.parse(input.discountNode.products?.value ?? '[]')
    const minQty: number = Number(discountMeta.minQty)
    const minValue: number = Number(discountMeta.minValue)
    for(let line of input.cart.lines){
       if(
        (products.length == 0 || products.indexOf(line.id) > -1) &&
        line.quantity > minQty &&
        line.cost.subtotalAmount.amount > minValue
        ){
        let productVariantTgt = {
            id: (line.merchandise as ProductVariant).id,
        }
        targets.push(
            {productVariant: productVariantTgt}
        )
       }

    }
    return targets
}

export default (input: InputQuery): FunctionResult => {
    try{
        const discountMeta: ShopifyDiscountMeta = JSON.parse(input.discountNode.discount_meta!.value)
        if(!isDiscountAllowed(input) || isAlreadyUsed(input,discountMeta)){
            return EMPTY_DISCOUNT
        }
        const targets: Array<Target> = setTargets(input, discountMeta)
        const value: Value = setDiscountValue(input, discountMeta)
        const discount: Discount = {
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
