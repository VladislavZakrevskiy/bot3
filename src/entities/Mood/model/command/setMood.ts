import { Markup } from "telegraf";
import { getBot } from "../../../../shared/lib/bot/createBot";
import { createKeyboards } from "../../../../shared/lib/telegrafHelpers/createKeyboard";
import prisma from "../../../../shared/db/prisma";

export const configureMoodCommand = () => {
	const bot = getBot();
	bot.command("set_mood", async (ctx) => {
		const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });
		if (!user) {
			ctx.reply("Ошибка!");
			return;
		}

		const keyboards = Markup.inlineKeyboard(
			createKeyboards(
				user.emoji_pack.length !== 0
					? user.emoji_pack.map((value) => value.toString("utf-8"))
					: ["😭", "😔", "😐", "😀", "😁"],
				"emoji"
			)
		);
		await ctx.reply("Какое у тебя сегодня было настроение?", keyboards);
	});
};
