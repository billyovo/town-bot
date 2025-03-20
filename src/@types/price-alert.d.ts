import { PriceAlertResult } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { Failure, Success } from "./utils";
import { PromotionType } from "./enum/price-alert";

export type ShopDetails = {
    shop: PriceAlertShopOption | null,
    domain: string | null,
    domainLong: string | null,
    hostname: string,
    url: string
};


// checked by comparing existing price in db with fetched new price
// where result is the result of the check, either price change or no change or error
export type PriceAlertChecked = {
    result: PriceAlertResult,
    data: PriceAlertItem,
    error?: string
}

export type ShopParseOptions = {
    skipImageFetch?: boolean,
}

// output of the parseShopWebsite function
// we will add some metadata before saving it to the db
// check schema.ts


export type PromotionClassified = {
    type: PromotionType,
    description: string,
    startTime?: Date,
    endTime?: Date
}
export type ParsePriceOutput = {
    price: number,
    productName: string,
    productImage: string | null,
    brand: string,
    shop: PriceAlertShopOption,
    promotions?: PromotionClassified[] | null
}

export type ShopParseFunctionReturn = Success<ParsePriceOutput> | Failure;

export type ShopParseFunction = (url: string, shopDetails: ShopDetails, options? : ShopParseOptions) => Promise<ShopParseFunctionReturn>;
