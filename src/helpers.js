
// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String

export function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export async function sha256(message) {

  // encode as UTF-8
  const msgBuffer = new TextEncoder('utf-8').encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return hashHex;
}

export function validateTransaction (transaction) {
  const validKeys = ['sender', 'receiver', 'type', 'amount'];
  const validTypes = ['transfer', 'deposit', 'withdrawl'];
  for (let key in transaction) {
    const value = transaction[key];
    
    if (!validKeys.includes(key)) {
      console.log("transaction includes invalid key: ", key)
      return false
    }
    
    if ((key === 'type') && !validTypes.includes(value)) {
      console.log("Invalid transaction type: ", value);
      return false
    }

    if (key === 'amount') {
      if (typeof value !== "number") {
        console.log("Amount is not a number");
        return false;
      }
    } else {
      if (typeof value !== "string"){
        console.log("type of ", key, " is not string")
        return false;
      }
    }
  }
  return true;
}

/* Usage

sha256('abc').then(hash => console.log(hash));

(async function() {
  const hash = await sha256('abc');
}());

*/