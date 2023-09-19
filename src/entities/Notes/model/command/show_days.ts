import { Markup } from "telegraf";
import prisma from "../../../../shared/db/prisma";
import { getBot } from "../../../../shared/lib/bot/createBot";
// import { createImg } from "../../../../shared/lib/img/createImg";

export const configureShowDaysCommand = () => {
	const bot = getBot();

	bot.command("show_last_ten_days", async (ctx) => {
		let days = await prisma.day.findMany({
			include: { notes: true },
			where: { User: { user_id: ctx.from.id } },
		});
		const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });
		const userEmojisArray = user?.emoji_pack.map((value) => value.toString("utf-8"));

		if (days.length === 0) {
			ctx.reply(`Простите, но дней нет! Создайте первую запись командой /set_mood`);
			//@ts-ignore
			return ctx.scene.leave();
		}

		if (days.length > 10) {
			days = days.slice(0, 10);
		}

		const data: number[] = [];
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
			data.push(result);

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
			// Markup.inlineKeyboard([[Markup.button.callback("Скачать график", "send_days")]])
		);

		// bot.action("send_days", async (ctx) => {
		// 	ctx.sendPhoto(createImg(data));
		// });
	});
};
