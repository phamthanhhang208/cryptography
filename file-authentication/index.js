const fs = require("fs");
const crypto = require("crypto");
const blockSize = 1024;
const filePath = "./file/birthday.mp4";

const stats = fs.statSync(filePath);
const fileSize = stats.size;

const readReversedChunks = (file, fileSize, chunkSize, lastChuckSize) => {
	let iter = 0;
	let lastPos = fileSize;
	let result = [];
	while (lastPos > 0) {
		size = chunkSize;
		if (iter === 0) {
			size = lastChuckSize;
		}
		f = Buffer.from(file.subarray(lastPos - size, lastPos));
		result.push({ chunk: lastPos - size, buffer: f });
		iter++;
		lastPos -= size;
	}
	return result;
};

const calculateHashFile = (filePath) => {
	const lastBlockofFile = fileSize % blockSize;
	console.log(`Opening file: ${filePath} ; ${fileSize} bytes`);
	const file = fs.readFileSync(filePath);
	let lastHash = "";
	const chunks = readReversedChunks(file, fileSize, blockSize, lastBlockofFile);
	for (let i = 0; i < chunks.length; i++) {
		hashSum = crypto.createHash("sha256");
		hashSum.update(chunks[i].buffer);
		if (lastHash) {
			hashSum.update(lastHash);
		}
		lastHash = hashSum.digest();
	}
	return console.log(lastHash);
};

calculateHashFile(filePath);

// Output :
// <Buffer 03 c0 8f 4e e0 b5 76 fe 31 93 38 13 9c 04 5c 89 c3 e8 e9 40 96 33 be a2 94 42 e2 14 25 00 6e a8>
