import { accountName } from '../config';
import { fibos } from './fibos';

export const transfer = async (to: string, quantity: number = 0.0001, memo = '') => {
  const eosioTokenContract = await fibos.contract('eosio.token');
  const res = await eosioTokenContract.transfer(
    {
      from: accountName,
      to: to,
      quantity: `${quantity.toFixed(4)} FO`,
      memo: memo,
    },
    {
      authorization: accountName,
    }
  );
  return res;
};
