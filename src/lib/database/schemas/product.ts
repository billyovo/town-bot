import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { Schema, model } from "mongoose";
import { PromotionClassified } from "~/src/@types/price-alert";

export interface PriceAlertItem {
    lastChecked: Date,
    url: string,
    price: number,
    brand: string,
    productName: string,
    productImage: string | null,
    promotions?: PromotionClassified[] | null,
    shop: PriceAlertShopOption,
    failCount: number,
    previous?: {
        price: number,
        date: Date,
    },
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
	previous: {
		price: Number,
		date: Date,
	},
});

export const PriceAlertModel = model<PriceAlertItem>("products", priceAlertSchema);