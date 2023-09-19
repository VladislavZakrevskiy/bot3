import { Markup } from "telegraf";
import prisma from "../../../../shared/db/prisma";
import { MapperKeys, createKeyboards } from "../../../../shared/lib/telegrafHelpers/createKeyboard";
import { getActionString } from "../../../../shared/helpers/getActionString";
import { getBot } from "../../../../shared/lib/bot/createBot";

//@ts-ignore
export const setTheme = async (ctx) => {
	const bot = getBot();
	const user = await prisma.user.findUnique({ where: { user_id: ctx.from?.id } });
	if (!user) {
		ctx.reply("Возникла какая-то ошибка. Простите, я не могу сохранить заметку, попробуйте позже");
		return;
	}

	if (user.themes.length === 0) {
		ctx.reply("У вас нет тем, сначала добавьте темы");
	} else {
		ctx.reply("Выбере тему", Markup.inlineKeyboard(createKeyboards(user.themes, "theme")));
	}

	for (let i = 0; i < user.themes.length; i++) {
		bot.action(getActionString(Object.values(MapperKeys)[i], "theme"), async (ctx) => {
			const currentNotes = await prisma.note.findMany({
				where: {
					Day: { date: new Date().toLocaleDateString("ru"), User: { user_id: ctx.from?.id } },
				},
			});
			let earlyNote;
			for (let i = 0; i < currentNotes.length; i++) {
				if (!earlyNote) {
					earlyNote = currentNotes[i];
					continue;
				}
				const splitedEarlyTime = earlyNote.time.split(":");
				const splitedCurrentTime = currentNotes[i].time.split(":");
				// console.log(splitedCurrentTime, splitedEarlyTime);
				if (+splitedCurrentTime[0] > +splitedEarlyTime[0]) {
					earlyNote = currentNotes[i];
					continue;
				}

				if (+splitedCurrentTime[0] === +splitedEarlyTime[0]) {
					if (+splitedCurrentTime[1] > +splitedCurrentTime[1]) {
						earlyNote = currentNotes[i];
					}

					if (+splitedCurrentTime[1] === +splitedCurrentTime[1]) {
						if (+splitedCurrentTime[2] > +splitedCurrentTime[2]) {
							earlyNote = currentNotes[i];
						}

						if (+splitedCurrentTime[2] === +splitedCurrentTime[2]) {
							earlyNote = currentNotes[i];
						}
					}
				}
			}
			if (!earlyNote) {
				ctx.reply(
					"Возникла какая-то ошибка. Простите, я не могу сохранить заметку, попробуйте позже"
				);
				return;
			}

			earlyNote.themes = [user.themes[i]];
			await prisma.note.update({ where: { note_id: earlyNote.note_id }, data: earlyNote });
			await ctx.reply("Отлично все сохранил");
		});
	}
};
