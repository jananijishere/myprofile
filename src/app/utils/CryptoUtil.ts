import { environment } from 'src/environments/environment';
import CryptoJS from 'crypto-js'

export class CryptoUtil {
  constructor() {
    
  }

  static getAES(data) { //encrypt process
    var key = environment.cryptoKey;  //secret key
    // var key = this.randomString(32);
    var iv = environment.cryptoIV;  //Sixteen hexadecimal digits as the key offset
    // var iv = this.randomString(16);
    var encrypted = this.getAesString(data, key, iv); //encrypt code
    var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
  }

  static getAesString(data, key, iv) {//encrypt
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();    //returns in Base64 format
    //added for test
  }

  static getDAes(data) {//decrypt
    var key = environment.cryptoKey;  //secret key
    // var key = this.randomString(32);
    var iv = environment.cryptoIV;  //Sixteen hexadecimal digits as the key offset
    // var iv = this.randomString(16);
    var decryptedStr = this.getDAesString(data, key, iv);
    return decryptedStr;
  }

  static getDAesString(encrypted, key, iv) {//decrypt
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  static randomString(len){
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

}
