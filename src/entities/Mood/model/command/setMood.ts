import { Markup } from "telegraf";
import { getBot } from "../../../../shared/lib/bot/createBot";
import { createKeyboards } from "../../../../shared/lib/logic/telegrafHelpers/createKeyboard";

export const configureMoodCommand = () => {
	const bot = getBot();
	bot.command("set_mood", async (ctx) => {
		const keyboards = Markup.inlineKeyboard(
			createKeyboards(["😭", "😔", "😐", "😀", "😁"], "emoji")
		);
		await ctx.reply("Какое у тебя сегодня было настроение?", keyboards);
	});
};
