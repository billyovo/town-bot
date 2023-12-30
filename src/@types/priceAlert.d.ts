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

type Success = {
    data: PriceOutput,
    error: null,
    success: true
}

type Failure = {
    data: null,
    error: string,
    success: false
}

export type ShopParseFunctionReturn = Success | Failure;

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

export type ShopParseFunction = (url: string) => Promise<ShopParseFunctionResponse>;
