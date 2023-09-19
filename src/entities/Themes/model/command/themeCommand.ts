import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureThemeCommand = () => {
	const bot = getBot();

	//@ts-ignore
	bot.command("set_themes", async (ctx) => ctx.scene.enter("theme"));
};
