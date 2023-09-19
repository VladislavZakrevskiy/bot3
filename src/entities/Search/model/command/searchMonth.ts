import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureSearchMonthCommand = () => {
	const bot = getBot();

	//@ts-ignore
	bot.command("search_month", async (ctx) => ctx.scene.enter("search_month"));
};
