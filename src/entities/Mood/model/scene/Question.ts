import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";

export const getQuestionScene = () => {
	const question = new Scenes.BaseScene("notes");
	question.enter((ctx) => ctx.reply("Как прошел ваш день?"));
	question.on(message("text"), async (ctx) => {
		const currentNotes = await prisma.note.findMany({
			where: { Day: { date: new Date().toLocaleDateString(), User: { user_id: ctx.from.id } } },
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

			//@ts-ignore
			return ctx.scene.leave();
		}

		earlyNote.experience = ctx.message.text;
		await prisma.note.update({ where: { note_id: earlyNote.note_id }, data: earlyNote });
		await ctx.reply("Отлично все сохранил");
		//@ts-ignore
		return ctx.scene.leave();
	});

	return question;
};
