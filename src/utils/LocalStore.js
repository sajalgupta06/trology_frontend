
/**
 * Util library to use browser localStorage for persistent cache.
 * 
 * See also ./AppState.js which is primarily for memory store. 
 *
 */


const APP = 'trology';

//
// Supports setting of simple (key, value) pair.
// If the value is object, then it is stored as JSON.
//
//  Examples:
//     LocalStore.set('key1', 'value1');   // Simple Key, value
//     LocalStore.set('somekey', someobj); // someobj saved as JSON string.
//     LocalStore.set( { key1 : 'value1', key2 : 'value2' }); 
//                   Note: Multiple (key,value) pairs stored.
//     LocalStore.set(someobj, value_ignored); 
//                   If key is object, it contains (name,value) pairs.
//                   The second arg value is ignored.
//
//  Note: The get() method will not auto-convert to avoid surprises.
// 
export const set = (key, value) => {

  if (typeof key === 'string') 
  {
  	if (typeof value !== 'string')
  	    value = JSON.stringify(value);
  	return localStorage.setItem(`${APP}.${key}`, value);
  }
  else if (typeof key === 'object') {
    let obj = key;
    for (var name in obj) {
       if (obj.hasOwnProperty(name)) {
          let val = obj[name];
          if (typeof val !== 'string')
             val = JSON.stringify(val);
          localStorage.setItem(`${APP}.${name}`, val);
       }
    }
  }
}

export const get = (key) => localStorage.getItem(`${APP}.${key}`);

export const getEmail = () => get('email');

//
// Convert JSON string to Object.
// Parse ony if it is valid JSON string.
//
const parse = (s) => {

  // If already object or null or undefined, return as it is.
  if (typeof s !== 'string') return s;
  if (!s) return s;

  try {
     let obj = JSON.parse(s);
     return obj;
  } catch (e) {
     return s;
  }
}

export const getUser = () => {
    return parse(get('user'));
}

export const getUserSession = () => parse(get('userSession'));

export const getCreds = () => parse(get('creds'));

export const getNickName = () => {
  let email = get('email');
  if (email) return email;
  return 'Guest';
}

export const clearUser = () => {
  set('email', '');
  set('cognitoUser', null);
  set('userSession', null);
}


