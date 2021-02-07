import { accountName } from '../config';
import { fibos } from './fibos';

export const claimrewards = async () => {
  const res = await fibos.claimrewards(accountName);
  return res;
};
