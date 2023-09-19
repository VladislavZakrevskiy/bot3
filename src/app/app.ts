import { getBot } from "../shared/lib/bot/createBot";
import { moodModule } from "../entities/Mood";
import { emojiModule } from "../entities/Emoji";
import { themeModule } from "../entities/Themes";
import { helpModule } from "../entities/Help";
import { startModule } from "../entities/Start";
import { Scenes, session } from "telegraf";
import { getQuestionScene } from "../entities/Mood/model/scene/Question";
import { getThemeScene } from "../entities/Themes/model/scene/setTheme";
import { getEmojiScene } from "../entities/Emoji/model/scene/Emoji";
import { notesModule } from "../entities/Notes";
import { searchModule } from "../entities/Search";
import { searchMonthScene } from "../entities/Search/model/scene/searchMonth";
import { searchDayScene } from "../entities/Search/model/scene/searchDay";

export const app = () => {
	const bot = getBot();

	bot.use(session());

	const question = getQuestionScene();
	const theme = getThemeScene();
	const emoji = getEmojiScene();
	const searchDay = searchDayScene();
	const searchMonth = searchMonthScene();

	//@ts-ignore
	const stage = new Scenes.Stage([question, theme, emoji, searchDay, searchMonth]);
	//@ts-ignore
	bot.use(stage.middleware());

	moodModule();
	emojiModule();
	themeModule();
	startModule();
	helpModule();
	notesModule();
	searchModule();

	bot.on("message", async (ctx) => {
		ctx.reply("Я тебя не понимаю");
	});

	bot.launch();

	// Enable graceful stop
	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));

	console.log("Bot is started");
};
