import { PromotionType } from "~/src/@types/enum/price-alert";

const keywords : RegExp[] = [
	/買[一二三四五六七八九十]{1,2}送[一二三四五六七八九十]{1,2}/,
	/買\d+送\d+/,
	/半價/,
	/減\$*\d+/,
	/[一二三四五六七八九]{1,2}折/,
	/只需\$*\d+/,
	/\b\d+(\.\d+)\${0,1}?%{0,1} ?off\b/i,
	/Buy [0-9]+ get [0-9]+ free/i,
	/Get [0-9]+ free/i,
	/\b\d+(\.\d+)?% discount\b/i,
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