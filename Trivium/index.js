const bitwise = require("bitwise")
const fs = require('fs')
const util = require('util');
const { UInt8 } = require("bitwise/types")

//set up
function fillInternalState(key,initializationVector){
  const state = []
   for (let i = 0; i < 80; i++) {
    state.push(key[i]);
  }

  for (let i = 80; i < 93; i++) {
    state.push(0);
  }

  for (let i = 93, j = 0; i < 177; i++ , j++) {
    if (j < 80) {
      state.push(initializationVector[j]);
    } else {
      state.push(0);
    }
  }

  for (let i = 177; i < 285; i++) {
    state.push(0);
  }

  for (let i = 285; i < 288; i++) {
    state.push(1);
  }

  return state;
}

function shiftAndReplace(state,replace,start,end){
 for (let i = end - 1; i >= start; i--) {
    if (i === start) {
      state[i] = replace;
    } else {
      state[i] = state[i - 1];
    }
  }
}

// initialize Trivium 
function initializeInternalState(key, initializationVector){
  const state = fillInternalState(key,initializationVector)
  for (let i = 1; i <= 4 * 288; i++) {
    const t1 = state[65] ^ (state[90] & state[91]) ^ state[92] ^ state[170];
    const t2 = state[161] ^ (state[174] & state[175]) ^ state[176] ^ state[263];
    const t3 = state[242] ^ (state[285] & state[286]) ^ state[287] ^ state[68];

    shiftAndReplace(state, t3, 0, 93);
    shiftAndReplace(state, t1, 93, 177);
    shiftAndReplace(state, t2, 177, 288);
  }

  return state;
}

//key stream generation
function nextState(state){
  let t1 = state[65] ^ state[92];
  let t2 = state[161] ^ state[176];
  let t3 = state[242] ^ state[287];

  const key = (t1 ^ t2 ^ t3);

  t1 = t1 ^ (state[90] & state[91]) ^ state[170];
  t2 = t2 ^ (state[174] & state[175]) ^ state[263];
  t3 = t3 ^ (state[285] & state[286]) ^ state[68];

  shiftAndReplace(state, t3, 0, 93);
  shiftAndReplace(state, t1, 93, 177);
  shiftAndReplace(state, t2, 177, 288);

  return key;
}

function nextByte(state){
  const byte = new Array(8);

  for (let i = 0; i < 8; i++) {
    const key = nextState(state);
    byte[i] = key;
  }

  return bitwise.byte.write(byte);
}

// convert string to bitarray
function toBitarray(string){
  const buffer = Buffer.from(string);
  return bitwise.buffer.read(buffer);
}

function cipher(data, key, iv){
  if (key.length === 0 || iv.length === 0) {
    throw new Error("Key and IV length should not be empty");
  }

  const keyBitarray = toBitarray(key);
  const ivBitarray = toBitarray(iv);

  const state = initializeInternalState(keyBitarray, ivBitarray);

  const cipherBuffer = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i++) {
    const dataByte = data.readUInt8(i);
    const cipherByte = nextByte(state);
    cipherBuffer.writeUInt8(cipherByte ^ dataByte, i);
  }

  return cipherBuffer;
}

// function cipherBmp(data, key, iv){
//   const BMP_HEADER_SIZE = 54;
//   const header = data.slice(0, BMP_HEADER_SIZE);
//   const payload = data.slice(BMP_HEADER_SIZE);

//   const cipheredPayload = cipher(payload, key, iv);

//   return Buffer.concat([header, cipheredPayload]);
// }

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


async function encryptFile(){
  const key = '0123456789'
  const iv = '0123456789'
  let file
 try{
  file = await readFile('./test.txt')
  const cipherData = cipher(file,key,iv)
  await writeFile('./decrypt.txt', cipherData) 
 } catch (e) {
   console.log(e)
   process.exit(1)
  }
  console.log('encrypted file')
  process.exit(0)
}


(async()=>{encryptFile()})()