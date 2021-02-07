import FIBOS from 'fibos.js';
import { httpEndpoint, privateKey } from '../config';

export const fibos = FIBOS({
  chainId: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
  keyProvider: privateKey,
  httpEndpoint: httpEndpoint,
});
