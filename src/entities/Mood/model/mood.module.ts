import prisma from "../../../shared/db/prisma";
import { moodActions } from "./actions/moodActions";
import { configureMoodCommand } from "./command/setMood";

export const moodModule = () => {
	configureMoodCommand();
	moodActions();

	console.log();
};
