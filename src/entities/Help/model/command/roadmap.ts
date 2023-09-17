import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureRoadmapCommand = () => {
	const bot = getBot();

	bot.command("roadmap", async (ctx) => {
		ctx.reply("");
	});
};
