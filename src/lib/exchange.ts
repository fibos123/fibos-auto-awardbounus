import { accountName } from '../config';
import { fibos } from './fibos';

export const exchange = async (quantity: number = 0.0001) => {
  const eosioTokenContract = await fibos.contract('eosio.token');
  const res = await eosioTokenContract.exchange(
    {
      owner: accountName,
      quantity: `${quantity.toFixed(4)} FO@eosio`,
      to: '0.000000 FOUSDT@eosio',
      price: 0,
      id: accountName,
      memo: `${quantity.toFixed(4)} FO@eosio 0.000000 FOUSDT@eosio`,
    },
    {
      authorization: accountName,
    }
  );
  return res;
};
