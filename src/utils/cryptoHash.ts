import CryptoJS from 'crypto-js';
import { HASH_KEYWORD } from '.';

export const hashCode = (id, requestId) => {
  return CryptoJS.AES.encrypt(String(id + requestId), HASH_KEYWORD)
    .toString()
    .substr(-7);
};
