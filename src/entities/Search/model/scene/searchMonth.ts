import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";

export const searchMonthScene = () => {
	try {
		const question = new Scenes.BaseScene("search_month");
		question.enter((ctx) =>
			ctx.reply(
				"Какой месяц вы хотите увидеть? Напишите только цифру. Например, 3 ( означает март )"
			)
		);
		question.on(message("text"), async (ctx) => {
			const month = ctx.message.text;
			const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });
			if (!user) {
				ctx.reply(
					"Возникла какая-то ошибка. Простите, я не могу сохранить заметку, попробуйте позже"
				);

				//@ts-ignore
				return ctx.scene.leave();
			}

			let days = await prisma.day.findMany({
				include: { notes: true },
				where: {
					User: { user_id: ctx.from.id },
					date: { contains: month.length === 1 ? `.0${month}.` : `.${month}.` },
				},
			});
			const userEmojisArray = user?.emoji_pack.map((value) => value.toString("utf-8"));

			if (days.length === 0) {
				ctx.reply(`Простите, но дней нет! Создайте первую запись командой /set_mood`);
				//@ts-ignore
				return ctx.scene.leave();
			}

			if (days.length > 10) {
				days = days.slice(0, 10);
			}

			const daysNotes = days.map((day) => {
				const notes = day.notes;
				let result = 0;

				for (let i = 0; i < notes.length; i++) {
					const note = notes[i];
					switch (note.mood) {
						case "ONE":
							result += 1;
							break;
						case "TWO":
							result += 2;
							break;
						case "THREE":
							result += 3;
							break;
						case "FOUR":
							result += 4;
							break;
						case "FIVE":
							result += 5;
							break;
					}
				}

				result = Math.floor(result / notes.length) || 1;

				let emoji = "";
				switch (result) {
					case 1:
						emoji = (userEmojisArray?.[0] || "🟫") + " " + "1️⃣";
						break;
					case 2:
						emoji = (userEmojisArray?.[1] || "🟥") + " " + "2️⃣";
						break;
					case 3:
						emoji = (userEmojisArray?.[2] || "🟧") + " " + "3️⃣";
						break;
					case 4:
						emoji = (userEmojisArray?.[3] || "🟨") + " " + "4️⃣";
						break;
					case 5:
						emoji = (userEmojisArray?.[4] || "🟩") + " " + "5️⃣";
						break;
				}

				return `${day.date} - ${emoji}\n`;
			});

			await ctx.reply(
				`Среднее настроение за ${
					`${days[0].date}-${days[days.length - 1].date}` || "эти дни"
				}\n${daysNotes.join("")}`
			);
			//@ts-ignore
			return ctx.scene.leave();
		});

		return question;
	} catch (e) {
		console.log(e);
	}
};
