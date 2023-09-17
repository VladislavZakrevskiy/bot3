import { getBot } from "../../../../shared/lib/bot/createBot";

export const configureEmojiCommand = () => {
	const bot = getBot();
	//@ts-ignore
	bot.command("set_emoji", async (ctx) => ctx.scene.enter("emoji"));
};
