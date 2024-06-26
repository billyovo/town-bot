export const timeStringToMills : Record<string, number> = {
	s: 1000,
	second: 1000,
	seconds: 1000,
	m: 1000 * 60,
	mins: 1000 * 60,
	minute: 1000 * 60,
	minutes: 1000 * 60,
	h: 1000 * 60 * 60,
	hour: 1000 * 60 * 60,
	hours: 1000 * 60 * 60,
	hr: 1000 * 60 * 60,
	hrs: 1000 * 60 * 60,
	d: 1000 * 60 * 60 * 24,
	day: 1000 * 60 * 60 * 24,
	days: 1000 * 60 * 60 * 24,
	w: 1000 * 60 * 60 * 24 * 7,
	week: 1000 * 60 * 60 * 24 * 7,
	weeks: 1000 * 60 * 60 * 24 * 7,
	M: 1000 * 60 * 60 * 24 * 30,
	mo: 1000 * 60 * 60 * 24 * 30,
	month: 1000 * 60 * 60 * 24 * 30,
	months: 1000 * 60 * 60 * 24 * 30,
	y: 1000 * 60 * 60 * 24 * 365,
	year: 1000 * 60 * 60 * 24 * 365,
	years: 1000 * 60 * 60 * 24 * 365,
};

export const timeToHuman : Record<string, number> = {
	"second": 1000,
	"minute": 1000 * 60,
	"hour": 1000 * 60 * 60,
	"day": 1000 * 60 * 60 * 24,
	"week": 1000 * 60 * 60 * 24 * 7,
	"month": 1000 * 60 * 60 * 24 * 30,
	"year": 1000 * 60 * 60 * 24 * 365,
};