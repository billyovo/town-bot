import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { AttachmentBuilder } from "discord.js";
import { ObjectId } from "mongodb";

export type PriceOutput = {
    price: number,
    productName: string,
    productImage: string,
    brand: string,
    shop: PriceAlertShopOption,

    // this is productImage, but we need to fetch it from the URL first sometimes.
    attachment?: AttachmentBuilder | null
}

export type ShopDetails = { shop: PriceAlertShopOption | null, domain: string };

export type Success<T> = {
    data: T,
    error?: null,
    success: true
}

export type Failure = {
    data: null,
    error: string,
    success: false
}

export type ShopParseFunctionReturn = Success<PriceOutput> | Failure;

export type PriceAlertItem = {
    _id?: ObjectId | undefined,
    previous?: {
        price: number,
        date: Date
    },
    lastChecked: Date,
    url: string,
    failCount?: number,
} & PriceOutput;

export type PriceAlertChecked = {
    result: PriceAlertResult,
    data: PriceAlertItem,
    error?: string
}

export type ShopParseOptions = {
    skipImageFetch: boolean
}
export type ShopParseFunction = (url: string, options? : ShopParseOptions) => Promise<ShopParseFunctionReturn>;
