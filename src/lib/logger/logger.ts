import pino from "pino";

const pretty = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
};

export const logger = pino(process.env.NODE_ENV === "production" ? {} : pretty);