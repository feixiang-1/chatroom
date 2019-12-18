const NodeRSA = require('node-rsa')

const {privatePem} = require('./config/privateKey')
const CryptoJS = require('crypto-js')

function aes_decrypt(ciphertext, a, b) {
  var decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(a), {iv: CryptoJS.enc.Utf8.parse(b)});
  return decrypted.toString(CryptoJS.enc.Utf8);
}



module.exports = (msg) => {
    let msgObj = JSON.parse(msg) || '';
    if (msgObj) {
      const rsa= new NodeRSA(privatePem);
      rsa.setOptions({encryptionScheme: 'pkcs1'});
      try{
        // 如果需要对AES加密的消息做一些操作，则需要通过RSA私钥解密出AES密钥，之后通过AES密钥解密出消息；
        let AESKEYStr = rsa.decrypt(msgObj.encryptedAESKEY, 'utf8');
        let {AES_KEY, AES_IV} = JSON.parse(AESKEYStr);
        
        return aes_decrypt(msgObj.encrypted, AES_KEY, AES_IV); 

        
      }catch(e){
        console.log(e)
        console.log('incorrect key');
      }

    }
    
    
   
  
}
