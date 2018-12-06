'use strict';

// code extrapolated from
// https://github.com/MrToph/generator-eos/blob/2.4.0/generators/app/templates/scripts/init_blockchain/index.js

const ecc = require('eosjs-ecc');
const { sendTransaction, createAction, getErrorDetail } = require('./transact');

const EOSIO_SYSTEM_ACCOUNT = 'eosio';

module.exports = {
  async createAccount({ api, account }) {
    const { EOSIO_PRIVATE_KEY } = process.env;
    const EOSIO_PUBLIC_KEY = ecc.privateToPublic(EOSIO_PRIVATE_KEY);
    try {
      await api.rpc.get_account(account);
      console.log(`"${account}" already exists`);
      return;
    } catch (e) {
      // account doesn't exist, so lets create it
    }

    try {
      await sendTransaction({ api, actions:
        createAction({
          account: EOSIO_SYSTEM_ACCOUNT,
          name: 'newaccount',
          actor: EOSIO_SYSTEM_ACCOUNT,
          data: {
            creator: EOSIO_SYSTEM_ACCOUNT,
            name: account,
            owner: {
              threshold: 1,
              keys: [
                {
                  key: EOSIO_PUBLIC_KEY,
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
            active: {
              threshold: 1,
              keys: [
                {
                  key: EOSIO_PUBLIC_KEY,
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
          },
        })});
    } catch (error) {
      console.error('Could not create account: ', getErrorDetail(error));
    }
  },
};
'';
