import { ASCII_LOGO } from "../../../constants/branding.js";
import { START_DATE } from "../../../index.js";
import { formatRelativeTime } from "../../utils/date.js";
import ApplicationsManager from "../applications.js";

export class Command {
	/**
	 * @param {string} name 
	 * @param {Function} execute 
	 */
	constructor(name, execute) {
		this.name = name;
		this.execute = execute;
		this.aliases = [];
	}

	addAlias(alias) {
		this.aliases.push(alias);
	}

	static find(name) {
		let matchCommand = null;

		this.COMMANDS.forEach((command) => {
			if (command.name === name) {
				matchCommand = command;
				return;
			}
		});

		return matchCommand;
	}

	static COMMANDS = [
		new Command("echo", (args) => {
			return args.join(" ");
		}),
		new Command("clear", (args, { pushHistory }) => {
			pushHistory({
				clear: true,
				isInput: false
			});

			return { blank: true };
		}),
		new Command("ls", (args, { currentDirectory }) => {
			let directory = currentDirectory;

			if (args.length > 0) {
				directory = currentDirectory.navigate(args[0]);
			}

			if (!directory)
				return `ls: Cannot access '${args[0]}': No such file or directory`;

			const folderNames = directory.subFolders.map((folder) => folder.id);
			const fileNames = directory.files.map((file) => file.id);

			const contents = folderNames.concat(fileNames);

			if (contents.length === 0)
				return { blank: true };

			return contents.sort((nameA, nameB) => nameA.localeCompare(nameB)).join(" ");
		}),
		new Command("cd", (args, { currentDirectory, setCurrentDirectory }) => {
			const path = args[0] ?? "~";
			const destination = currentDirectory.navigate(path);

			if (!destination)
				return `cd: ${args[0]}: No such file or directory`;

			console.log(destination);
			setCurrentDirectory(destination);
			return { blank: true };
		}),
		new Command("dir", (args, { currentDirectory }) => {
			const folderNames = currentDirectory.subFolders.map((folder) => folder.id);

			if (folderNames.length === 0)
				return { blank: true };

			return folderNames.sort((nameA, nameB) => nameA.localeCompare(nameB)).join(" ");
		}),
		new Command("pwd", (args, { currentDirectory }) => {
			if (currentDirectory.root) {
				return "/";
			} else {
				return currentDirectory.absolutePath;
			}
		}),
		new Command("touch", (args, { currentDirectory }) => {
			const [name, extension] = args[0].split(".");

			if (currentDirectory.findFile(name, extension))
				return { blank: true };

			currentDirectory.createFile(name, extension);
			return { blank: true };
		}),
		new Command("mkdir", (args, { currentDirectory }) => {
			const name = args[0];

			if (currentDirectory.findSubFolder(name))
				return { blank: true };

			currentDirectory.createFolder(name);
			return { blank: true };
		}),
		new Command("rm", (args, { currentDirectory }) => {
			const [name, extension] = args[0].split(".");
			const file = currentDirectory.findFile(name, extension);

			if (!file)
				return `rm: ${args[0]}: No such file`;
			
			file.delete();
			return { blank: true };
		}),
		new Command("rmdir", (args, { currentDirectory }) => {
			const name = args[0];
			const folder = currentDirectory.findSubFolder(name);

			if (!folder)
				return `rm: ${args[0]}: No such directory`;
			
			folder.delete();
			return { blank: true };
		}),
		new Command("hostname", (args, { hostname }) => {
			return hostname;
		}),
		new Command("neofetch", (args, { username, hostname }) => {
			const leftColumn = ASCII_LOGO.split("\n");
			const rightColumnWidth = username.length + hostname.length + 1;
			const rightColumn = [
				`${username}@${hostname}`,
				"-".repeat(rightColumnWidth),
				"OS: ProzillaOS",
				`UPTIME: ${formatRelativeTime(START_DATE, 2, false)}`,
				`RESOLUTION: ${window.innerWidth}x${window.innerHeight}`,
				"THEME: default",
				"ICONS: Font Awesome",
				`TERMINAL: ${ApplicationsManager.getApplication("terminal")?.name ?? "Unknown"}`,
			];

			const combined = [];
			for (let i = 1; i < leftColumn.length; i++) {
				let line = `${leftColumn[i]}  `;

				if (i <= rightColumn.length) {
					line += rightColumn[i - 1];
				} else {
					// This fixes a weird display bug on Safari mobile
					line += " ".repeat(rightColumnWidth);
				}

				combined.push(line);
			}

			return combined.join("\n");
		}),
	];
}