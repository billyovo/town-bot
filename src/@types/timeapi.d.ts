export type TimeAPIConversionData = {
	fromTimezone: string,
	fromDateTime: string,
	toTimeZone: string,
	conversionResult: {
		year: number,
		month: numbe,
		day: number,
		hour: numbe,
		minute: number,
		seconds: number,
		milliSeconds: number,
		dateTime: string,
		date: string,
		time: string,
		timeZone: string,
		dstActive: boolean,
	},
}

export type TimeAPICurrentTimeData = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	seconds: number;
	milliSeconds: number;
	dateTime: string;
	date: string;
	time: string;
	timeZone: string;
	dayOfWeek: string;
	dstActive: boolean;
}
