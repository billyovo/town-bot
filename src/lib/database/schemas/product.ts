import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { Schema, model } from "mongoose";
import { PromotionClassified } from "~/src/@types/price-alert";

export interface PriceAlertItem {
    lastChecked: Date,
    url: string,
    price: number,
    brand: string,
    productName: string,
	quantity: number,
    productImage: string | null,
    promotions?: PromotionClassified[] | null,
    shop: PriceAlertShopOption,
    failCount: number,
    previous?: {
        price: number,
        date: Date,
    },
}
export type ShopPriceItem = Omit<PriceAlertItem, "brand" | "productName">;
export interface PriceAlertGrouped {
	productName: string,
	brand: string,
	shops: ShopPriceItem[]
}
const promotionSchema = new Schema({
	type: String,
	description: String,
	startTime: Date,
	endTime: Date,
}, { _id: false });

const priceAlertSchema = new Schema<PriceAlertItem>({
	lastChecked: Date,
	url: String,
	price: Number,
	brand: String,
	productName: String,
	productImage: String,
	promotions: {
		type: [promotionSchema],
		default: [],
	},
	shop: String,
	failCount: Number,
	quantity: Number,
	previous: {
		price: Number,
		date: Date,
	},
});

export const PriceAlertModel = model<PriceAlertItem>("products", priceAlertSchema);