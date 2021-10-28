## Many Time Pad

### Purpose:
- Understand the structure features of stream ciphers
- Programming implements a cracking of a stream cipher encryption example to further understand the problems caused by multiple use of the same key in stream cipher encryption.

### Problem:
- This project observes the serious consequences of encrypting multiple plaintext with the same stream cipher key.
- There are 11 hexadecimal encoded ciphers, which are the result of encrypting 11 plaintext with a stream cipher, all of which use the same stream cipher key.
- The goal of the project is to decrypt the last ciphertext and submit clear text messages.

### Solution:
- The core of stream encryption algorithm is bitwise exclusive or operation. If you want to decrypt data, you only need bitwise exclusive or between ciphertext and key string to get the original data.
```
          PlainText XOR Key = CipherText
```
- The XOR of empty characters and small (large) letters leads to the corresponding lowercase (or uppercase) letters
```
          'a' XOR '  ' = 'A'
          'A' XOR '  ' = 'a'
```
#### Approach 1: 
- [File](./ManyTimePad.js)
- [Live Demo](https://replit.com/@xmichiyo99/HackingManyTimePad#index.js)
- Because of the XOR algorithm, if multiple data are encrypted using the same key string, the attacker can crack the data without guessing the key string. The reasons are as follows:
```
          PlainText1 XOR Key = CipherText1
          PlainText2 XOR Key = CipherText2
          CipherText1 XOR CipherText2 = PlainText1 XOR Key XOR PlainText2 XOR Key = PlainText1 XOR PlainText2
```
Therefore, if a certain position on a plaintext is empty character, then the corresponding position of ciphertext is XOR with that of other ciphertexts, and the result is likely to be lowercase (or uppercase) letters

#### Approach 2: 
- [File](./ManyTimePad2.js)
- [Live Demo](https://replit.com/@xmichiyo99/HackingManyTimePad2)
- According to approach #1, we can conclude that the more the number of XOR ciphertexts, the higher the accuracy. 
- If a certain position of ciphertext is determined to be a null character, then XOR the position with the null character will get the key to the position, that is: 
```
            CipherText = Space XOR Key
            CipherText XOR Space = Space XOR Key XOR Space = Key
```
- After retriving all location of the empty characters, the key can be obtained

