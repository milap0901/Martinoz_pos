
const fs = require("fs").promises;

const setupMainDatabase = async (destinationFolder, sourceFile, destinationFile) => {
	try {
		const folderExists = await fs
			.access(destinationFolder)
			.then(() => true)
			.catch(() => false);
		if (!folderExists) {
			await fs.mkdir(destinationFolder, { recursive: true });
			console.log("Folder created successfully.");
		}

		const fileExists = await fs
			.access(destinationFile)
			.then(() => true)
			.catch(() => false);
		if (!fileExists) {
			await fs.copyFile(sourceFile, destinationFile);
			console.log("File copied successfully.");
		} else {
			console.log("File already exists in the destination folder.");
		}
	} catch (error) {
		console.error("Error:", error);
	}
};

module.exports = { setupMainDatabase };
