# Week 3: File Authentication System with SHA256

The naive approach to authenticate a very large video file hosted on a web server is for the browser to download the entire file and check that its hash is equal to the authentic hash value provided by the website via some authenticated channel. Unfortunately, this means that the video can only be played after the entire file has been downloaded.

Our goal in this project is to build a file authentication system that lets browsers authenticate and play video chunks as they are downloaded without having to wait for the entire file. The website generates the authentic hash value as follows:

1. Break down file into 1KB blocks (1024 bytes).
2. Compute hash of the last block and append value to the second to last block.
3. Compute hash of this augmented second to last block and append value to the third from the end.
4. Repeat process to the first block.

The final hash value `h0` (hash of the first block with its appended hash) is distributed to users via the authenticated channel.

Browser downloads the file one block at a time, where each block includes the appended hash value as above.

1. When the first block is received the browser checks that its hash is equal to `h0`.
2. When the second block is received the browser checks that its hash is equal to `h1`.
3. The process continues until the last block.
   Each block is authenticated and played as it is received and there's no need to wait until the entire file is downloaded.

We use an existing [crypto module] in NodeJS, for its SHA256 hashes.

[crypto module]: https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/

If the file size is not a multiple of 1KB then the very last block will be shorter than 1KB, but all other blocks will be exactly 1KB.

Compute the hash `h0` of a given file F and verify blocks of F as they are received by the client.
