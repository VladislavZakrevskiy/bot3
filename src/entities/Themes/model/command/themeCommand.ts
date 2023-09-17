import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureThemeCommand = () => {
	const bot = getBot();

	//@ts-ignore
	bot.command("themes_set", async (ctx) => ctx.scene.enter("theme"));
};
