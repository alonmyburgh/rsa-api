let keyStore = {};

/**
 * Returns KeyObject from key ID or undefined
 * @param {string} KeyID
 * @returns {privateKey: Object, publicKey: Object} 
 */
const getKeyById = keyId => {
    return keyStore[keyId];    
};

/**
 * Stores KeyObject with key ID
 * @param {*} keyId 
 * @param {*} keyObject 
 */
const storeKeyById = (keyId, keyObject) => {
    keyStore[keyId] = keyObject;    
};

/**
 * gets all key IDs
 */
 const getAllKeys = () => {
    return Object.keys(keyStore)
    // .map((v) => {
    //     return v;
    // })    
};

/**
 * Removes KeyObject from keyStore by key ID
 * @param {string} KeyID
 */
 const removeKeyById = keyId => {
    delete keyStore[keyId];
};

module.exports = { getKeyById, storeKeyById, getAllKeys, removeKeyById }