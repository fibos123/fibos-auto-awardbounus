import fetch from 'node-fetch';
import { accountName } from '../config';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface IVoter {
  owner: string;
  staked: number;
}

export interface IResponseVoter {
  owner: string;
  staked: string;
  last_vote_weight: string;
  is_proxy: false;
}

const sum = (accumulator: number, currentValue: number) => accumulator + currentValue;

export const getVoters = async () => {
  const voters: IVoter[] = [];
  let page = 0;
  let isMore = true;
  do {
    const url = 'https://idc.blockeden.cn:446/explorer/voter?producer=' + accountName + '&page=' + page;
    const resRaw = await fetch(url);
    const res: IResponseVoter[] = await resRaw.json();
    res.map(v => {
      voters.push({
        owner: v.owner,
        staked: parseInt(v.staked),
      });
    });
    isMore = res.length ? true : false;
    page++;
  } while (isMore);
  const totalStaked = voters.map(v => v.staked).reduce(sum);
  return {
    voters,
    totalStaked,
  };
};
