import fetch from 'node-fetch';
import { accountName, httpEndpoint } from '../config';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface IVoter {
  owner: string;
  staked: number;
}

export interface IVoters {
  rows: Row[];
  more: boolean;
}

export interface Row {
  owner: string;
  proxy: string;
  producers: string[];
  staked: number | string;
  last_vote_weight: string;
  proxied_vote_weight: string;
  is_proxy: number;
}

const sum = (accumulator: number, currentValue: number) => accumulator + currentValue;

export const getVoters = async () => {
  let voters: IVoter[] = [];
  let page = 0;
  let isMore = true;
  let lower_bound = '';
  do {
    const limit = 200;
    const data = { json: true, scope: 'eosio', code: 'eosio', table: 'voters', limit, lower_bound };
    const resRaw = await fetch(httpEndpoint + '/v1/chain/get_table_rows', {
      body: JSON.stringify(data),
      method: 'POST',
    });
    const res: IVoters = await resRaw.json();
    if (res.more && res.rows.length !== limit) {
      console.log(`limit error: need ${limit}, but ${res.rows.length}`);
      continue;
    }
    if (res.rows.length && res.rows[0].owner === lower_bound) {
      res.rows.shift();
    }
    lower_bound = res.rows[res.rows.length - 1].owner;
    voters.push(
      ...res.rows
        .filter(v => v.producers.includes(accountName))
        .map(v => ({
          owner: v.owner,
          staked: parseInt(v.staked.toString()),
        }))
    );
    isMore = res.more;
    page++;
    console.log('get voters page', page, lower_bound);
  } while (isMore);
  voters = voters.sort(compare('staked')).reverse();
  const totalStaked = voters.map(v => v.staked).reduce(sum);
  return {
    voters,
    totalStaked,
  };
};

function compare(p) {
  return function (m, n) {
    var a = m[p];
    var b = n[p];
    return a - b;
  };
}
