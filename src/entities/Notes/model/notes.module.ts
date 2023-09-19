import { configureShowDaysCommand } from "./command/show_days";
import { configureShowNotesCommand } from "./command/show_notes";

export const notesModule = () => {
	configureShowDaysCommand();
	configureShowNotesCommand();
};
