'use strict';

const path = require('path');
const eos = require('..').connect({ url: 'http://127.0.0.1:7777' });

(async () => {
  const account = 'someaccount';

  try {
    await eos.createAccount({ account });

    await eos.deploy({
      account,
      contract: 'eosio.token',
      contractDir: path.join(__dirname, 'build'),
    });

    const symbol = 'TESTS';

    const createTokenAction = eos.createAction({
      name: 'create',
      account,
      actor: account,

      data: { maximum_supply: `100 ${symbol}`, issuer: 'someissuer' },
    });

    await eos.sendTransaction(createTokenAction);

    const response = (await eos.api.rpc.get_currency_stats(account, symbol))[symbol];

    console.log(response);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
