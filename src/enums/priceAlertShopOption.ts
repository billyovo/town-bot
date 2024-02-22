import { ShopParseFunction } from "~/types/priceAlert";
import { parseAeonPrice } from "~/utils/scraper/parse/websites/aeon";
import { parseHktvmallPrice } from "~/utils/scraper/parse/websites/hktvmall";
import { parseLookfantasticPrice } from "~/utils/scraper/parse/websites/lookfantastic";
import { parseManningsPrice } from "~/utils/scraper/parse/websites/mannings";
import { parseMujiPrice } from "~/utils/scraper/parse/websites/muji";
import { parseSephoraPrice } from "~/utils/scraper/parse/websites/sephora";
import { parseWatsonsGroupPrice } from "~/utils/scraper/parse/websites/watsonsGroup";
import { parseWellcomePrice } from "~/utils/scraper/parse/websites/wellcome";

type ParseDetails = {
    image: string;
    parseFunction: ShopParseFunction;
};

export enum PriceAlertShopOption {
    HKTVMALL = "HKTVMALL",
    WATSONS = "WATSONS",
    AEONCITY = "AEONCITY",
    PNS = "PNS",
    SEPHORA = "SEPHORA",
    MANNINGS = "MANNINGS",
    MUJI = "MUJI",
    WELLCOME = "WELLCOME",
	LOOKFANTASTIC = "LOOKFANTASTIC",
}

export const PriceAlertShopParseDetails: Record<PriceAlertShopOption, ParseDetails> = {
	HKTVMALL: {
		image: "https://i.imgur.com/wYnaMoS.png",
		parseFunction: parseHktvmallPrice,
	},
	WATSONS: {
		image: "https://i.imgur.com/VJ2JDG9.png",
		parseFunction: parseWatsonsGroupPrice,
	},
	AEONCITY: {
		image: "https://i.imgur.com/nopW4EX.png",
		parseFunction: parseAeonPrice,
	},
	PNS: {
		image: "https://i.imgur.com/cT0UG1S.png",
		parseFunction: parseWatsonsGroupPrice,
	},
	SEPHORA: {
		image: "https://pbs.twimg.com/profile_images/459373077822861312/nHUto8C6_400x400.jpeg",
		parseFunction: parseSephoraPrice,
	},
	MANNINGS: {
		image: "https://i.imgur.com/OnplWyK.jpg",
		parseFunction: parseManningsPrice,
	},
	MUJI: {
		image: "https://i.imgur.com/ykFhg6J.png",
		parseFunction: parseMujiPrice,
	},
	WELLCOME: {
		image: "https://i.imgur.com/A5ogcsY.png",
		parseFunction: parseWellcomePrice,
	},
	LOOKFANTASTIC: {
		image: "https://pbs.twimg.com/profile_images/1687076928635711488/G0CE0Q8-_400x400.jpg",
		parseFunction: parseLookfantasticPrice,
	},
} satisfies Record<PriceAlertShopOption, ParseDetails>;

export enum PriceAlertListMode {
    ALL = "all",
    DETAILED = "detailed",
}

export enum PriceAlertResult {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    PRICE_CHANGE = "PRICE_CHANGE"
}
