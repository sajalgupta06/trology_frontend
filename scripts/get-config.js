const config = require('../config.json');


function parsePath (path, sep) {
  if (path.indexOf('[') >= 0) {
    path = path.replace(/\[/g, '.').replace(/]/g, '');
  }
  return path.split(sep);
}

function parseKey (key, val) {
  // detect negative index notation
  if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
    return val.length + parseInt(key, 10);
  }
  return key;
}

function pick(path, obj) {
  var i;
  var keys;
  var val;
  var key;
  var cp;

  keys = parsePath(path, '.')
  for (i = 0; i < keys.length; i++) {
    key = parseKey(keys[i], obj);
    if (obj && typeof obj === 'object' && key in obj) {
      if (i === (keys.length - 1)) {
        return obj[key];
      } else {
        obj = obj[key];
      }
    } else {
      return undefined;
    }
  }
  return obj;
}

const value = JSON.stringify(pick(process.argv[2], config)).replace(/^\"/,'').replace(/\"$/,'');
console.log(value);