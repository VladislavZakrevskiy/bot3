import { Markup } from "telegraf";
import prisma from "../../../../shared/db/prisma";
import { getBot } from "../../../../shared/lib/bot/createBot";
import { createKeyboards } from "../../../../shared/lib/telegrafHelpers/createKeyboard";

export const configureShowNotesCommand = () => {
	const bot = getBot();

	bot.command("show_notes_today", async (ctx) => {
		const notes = await prisma.note.findMany({
			where: { Day: { date: new Date().toLocaleDateString("ru", { timeZone: "Asia/Baku" }), User: { user_id: ctx.from.id } } },
			include: { Day: true },
		});
		const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });
		const userEmojisArray = user?.emoji_pack.map((value) => value.toString("utf-8"));

		if (notes.length === 0) {
			ctx.reply("Ошибка! Нет записей!");

			//@ts-ignore
			return ctx.scene.leave();
		}

		const noteText = notes.map((note) => {
			let emoji: string = "❓❓❓";
			switch (note.mood) {
				case "ONE":
					emoji = userEmojisArray?.[0] || "🟫";
					break;
				case "TWO":
					emoji = userEmojisArray?.[1] || "🟥";
					break;
				case "THREE":
					emoji = userEmojisArray?.[2] || "🟧";
					break;
				case "FOUR":
					emoji = userEmojisArray?.[3] || "🟨";
					break;
				case "FIVE":
					emoji = userEmojisArray?.[4] || "🟩";
					break;
			}

			return `${note.time} - ${emoji} [${note.themes.join(", ")}]\n`;
		});

		await ctx.reply(`Записи за ${notes[0].Day?.date || "день"}\n${noteText.join("")}`);
	});
};
