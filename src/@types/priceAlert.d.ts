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
    data: PriceAlertItem
}

export enum PriceAlertResult {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    PRICE_CHANGE = "PRICE_CHANGE"
}

export type ShopParseFunctionReturn = Promise<PriceOutput | null>;
export type ShopParseFunction = (url: string) => ShopParseFunctionReturn;
