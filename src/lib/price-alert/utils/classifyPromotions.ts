import { PromotionType } from "~/src/@types/enum/price-alert";

const keywords : RegExp[] = [
	// 買一送一, 買1送1 etc
	/買([一二三四五六七八九十]{1,2}|\d+)送([一二三四五六七八九十]{1,2}|\d+)/,
	/半價/,
	// 減$10, 減10%, 減10 etc
	/減\$*\d+.?\d*%?/,
	// 第一件免費, 第1件免費 etc
	/第([一二三四五六七八九十]{1,2}|\d+)件免費/,
	// 九折, 九五折, 9折 etc
	/([一二三四五六七八九]{1,2}|\d+(\.\d+)?)折/,
	// 只需$10, 只需10 etc
	/只需\${0,1}\d+.?\d*/,
	// $5 off, 5% off etc
	/(?=\S)(\s*\$?\s*\d+\s*%\s*off|\s*\$\s*\d+\s*off\s*|\s*\d+\s*%\s*off)/i,
	// get 1 free, get 1 for free etc
	/Get\s*\d+\s*(for\s*)?free/i,

	/half price/i,
];

export function classifyPromotionByKeywords(promotions: string) {
	if (keywords.some(keyword => keyword.test(promotions))) {
		return PromotionType.DISCOUNT;
	}
	else {
		return PromotionType.FREEBIE;
	}
}