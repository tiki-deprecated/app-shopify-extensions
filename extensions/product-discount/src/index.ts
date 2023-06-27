import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Discount,
  Target,
  Value,
  ProductVariant,
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

const setTargets = (input: InputQuery) => {
    let targets: Target[] = []
    const products: string[] = JSON.parse(input.discountNode.products?.value ?? '[]')
    const minQty: number = Number(input.discountNode.minQty?.value ?? '0')
    const minValue: number = Number(input.discountNode.minValue?.value ?? '0')
    for(let line of input.cart.lines){
       if(
        products.indexOf(line.id) > -1 &&
        line.quantity > minQty &&
        line.cost.subtotalAmount.amount > minValue
        ){
        targets.push(
            {productVariant: line.merchandise as ProductVariant}
        )
       }

    }
    return targets
}

export default (input: InputQuery): FunctionResult => {
    try{
        if(!isDiscountAllowed(input) || isAlreadyUsed(input)){
            return EMPTY_DISCOUNT
        }
        const targets: Array<Target> = setTargets(input)
        const value: Value = setDiscountValue(input)
        const discount: Discount = {
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
