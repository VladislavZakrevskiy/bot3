import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureSearchDayCommand = () => {
	const bot = getBot();

	//@ts-ignore
	bot.command("search_day", async (ctx) => ctx.scene.enter("search_day"));
};
