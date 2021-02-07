import { accountName } from '../config';
import { fibos } from './fibos';

export const getBalance = async () => {
  const accounts = await fibos.getTableRows({
    json: true,
    code: 'eosio.token',
    scope: accountName,
    table: 'accounts',
    table_key: '',
    lower_bound: '',
    upper_bound: '',
    limit: 100,
  });

  let balance = 0;

  if (accounts.rows && accounts.rows.length) {
    accounts.rows.map(account => {
      if (account.balance.quantity.substr(-2) === 'FO' && account.balance.contract === 'eosio') {
        balance = parseFloat(account.balance.quantity);
      }
    });
  }

  return balance;
};
