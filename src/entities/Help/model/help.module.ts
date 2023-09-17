import { configureHelpCommand } from "./command/help";
import { configureRoadmapCommand } from "./command/roadmap";

export const helpModule = () => {
	configureHelpCommand();
	configureRoadmapCommand();
};
