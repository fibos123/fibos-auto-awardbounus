import { backAccount, percent, memo } from './config';
import { getBalance } from './lib/get-balance';
import { getVoters } from './lib/get-voters';
import { transfer } from './lib/transfer';

interface IQueue {
  to: string;
  quantity: number;
}

const queues: IQueue[] = [];

const main = async () => {
  if (queues.length) return;

  try {
    const balance = await getBalance();
    console.log({ balance });
    if (balance < 10) return;
    const { voters, totalStaked } = await getVoters();
    queues.push({
      to: backAccount,
      quantity: balance * (1 - percent),
    });
    voters.map(v => {
      const quantity = (v.staked / totalStaked) * balance * percent;
      if (quantity >= 0.0001) {
        queues.push({
          to: v.owner,
          quantity: quantity,
        });
      }
    });
    console.log(queues);
    console.log({ length: queues.length });
  } catch (e) {
    console.log('main error:');
    console.error(e);
  }
};
main();

setInterval(main, 1 * 60 * 60 * 1000);

const onTransfer = async () => {
  if (!queues.length) return;
  const info = queues.shift() as IQueue;

  try {
    await transfer(info.to, info.quantity, memo);
    console.log(info.to, info.quantity.toFixed(4) + ' FO', `remain: ${queues.length}`);
  } catch (e) {
    queues.push(info);
    console.log('onTransfer error.');
  }
};

setInterval(onTransfer, 1 * 1000);
