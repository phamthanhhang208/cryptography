//import libraries
const fs = require("fs");
const crypto = require("crypto");
//constraints and file
const blockSize = 1024; //bytes
const fileCheck = "./file/birthday.mp4";
const actualResult =
	"03c08f4ee0b576fe319338139c045c89c3e8e9409633bea29442e21425006ea8";
const fileTarget = "./file/target.mp4";

/*
	The function reads a block of data (size `buffersize` in bytes)
    at a time, starting from the last block to the first block of the file
    The last block of the file (which is the first block we read)
    might be less than the buffersize while all other blocks are exactly
    of length `buffersize` 
*/

const readReversedChunks = (file, fileSize, chunkSize, lastChunkSize) => {
	let iter = 0;
	let lastPos = fileSize;
	let result = [];
	while (lastPos > 0) {
		size = chunkSize;
		if (iter === 0) {
			size = lastChunkSize;
		}
		//slice the buffer from "last_pos - size" to "lastPos"
		chunk = Buffer.from(file.subarray(lastPos - size, lastPos));
		result.push(chunk);
		iter++;
		lastPos -= size;
	}
	return result;
};

const calculateHashFile = (filePath) => {
	//get file size in bytes
	const stats = fs.statSync(filePath);
	const fileSize = stats.size;
	// get the last block size
	const lastBlockofFile = fileSize % blockSize;
	//open file, return a buffer
	console.log(`Opening file: ${filePath} ; ${fileSize} bytes`);
	const file = fs.readFileSync(filePath);
	let lastHash = ""; //the last hash (h0)
	//get chunks from file
	const chunks = readReversedChunks(file, fileSize, blockSize, lastBlockofFile);
	for (let i = 0; i < chunks.length; i++) {
		hashSum = crypto.createHash("sha256");
		hashSum.update(chunks[i]);
		if (lastHash) {
			hashSum.update(lastHash);
		}
		lastHash = hashSum.digest();
	}
	// convert lash hash buffer to hex string
	return lastHash.toString("hex");
};

// check if the algorithm is correct
const fileCheckResult = calculateHashFile(fileCheck);

console.log(
	fileCheckResult,
	fileCheckResult == actualResult ? "correct" : "wrong encoding result"
);

/* Output :
Opening file: ./file/birthday.mp4 ; 16927313 bytes
03c08f4ee0b576fe319338139c045c89c3e8e9409633bea29442e21425006ea8 correct 
*/

/* encode another video
link to video: https://www.youtube.com/watch?v=dQw4w9WgXcQ */

const fileTargetResult = calculateHashFile(fileTarget);

console.log(fileTargetResult);

/* Output : 
Opening file: ./file/target.mp4 ; 22161810 bytes
3a2513cb0051b412ad800f5e63510604ff6004eef2b2aa489d5853cb53156274 
*/
