import { Context, Telegraf } from "telegraf";

const bot = new Telegraf(
	process.env.TELEGRAM_TOKEN || "6422759568:AAFYNY7OVKJixiMKhRZSmjL6ZEITc9CdUVc"
);

export const getBot = () => bot;
