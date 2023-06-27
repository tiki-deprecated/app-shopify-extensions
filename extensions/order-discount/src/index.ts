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

const isAlreadyUsed = (input: InputQuery) => {
    const onePerUser: string | undefined = input.discountNode.onePerUser?.value
    const tid: string = input.discountNode.tid!.value
    if( onePerUser ){
        const discounUsed = input.cart.buyerIdentity?.customer?.discountUsed?.value ?? '[]'
        return JSON.parse(discounUsed).indexOf(tid) === -1
    }
    return false
}

const setDiscountValue = (input: InputQuery) => {
    const discountType = input.discountNode.discountType!.value
    const discountValue: number = Number(input.discountNode.discountValue!.value)
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

const setConditions = (input: InputQuery) => {
    if(input.discountNode?.minValue?.value ?? 0 > 0){
        return [{ 
            orderMinimumSubtotal: {
                minimumAmount: input.discountNode!.minValue!.value,
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
        if(!isDiscountAllowed(input) || isAlreadyUsed(input)){
            return EMPTY_DISCOUNT
        }
        const conditions: Array<Condition> = setConditions(input)
        const targets: Array<Target> = [{ orderSubtotal: { excludedVariantIds: [] } as OrderSubtotalTarget }]
        const value: Value = setDiscountValue(input)
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
