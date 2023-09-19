import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";

export const searchDayScene = () => {
	try {
		const question = new Scenes.BaseScene("search_day");
		question.enter((ctx) =>
			ctx.reply(
				"Напишите день, записи которого вы хотите увидеть. Например, 16.03.2006 ( означает 16 марта 2006 года ). Корректна только такая форма записи!"
			)
		);
		question.on(message("text"), async (ctx) => {
			const date = ctx.message.text;
			const notes = await prisma.note.findMany({
				where: { Day: { date: date, User: { user_id: ctx.from.id } } },
				include: { Day: true },
			});
			const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });

			if (notes.length === 0) {
				ctx.reply(
					"Возникла какая-то ошибка. Простите, я не могу показать вам этот день: его либо нет, либо вы неправильно ввели дату"
				);

				//@ts-ignore
				return ctx.scene.leave();
			}

			const userEmojisArray = user?.emoji_pack.map((value) => value.toString("utf-8"));

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

			//@ts-ignore
			return ctx.scene.leave();
		});

		return question;
	} catch (e) {
		console.log(e);
	}
};
