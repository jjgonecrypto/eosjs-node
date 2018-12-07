'use strict';

const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');
const { Api, JsonRpc, JsSignatureProvider } = require('eosjs');

require('dotenv').config({ path: path.join(__dirname, '/.required.env') });
const { EOS_CHAIN_ID, EOSIO_PRIVATE_KEY } = process.env;

const { deployContract } = require('./lib/deploy');
const { createAction, sendTransaction } = require('./lib/transact');
const { createAccount } = require('./lib/account');
const { generateAccountName } = require('./lib/util');

module.exports = {
  connect({ url }) {
    const signatureProvider = new JsSignatureProvider([EOSIO_PRIVATE_KEY]);

    const rpc = new JsonRpc(url, { fetch });
    const api = new Api({
      rpc,
      signatureProvider,
      chainId: EOS_CHAIN_ID,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    return Object.assign({ api }, module.exports);
  },

  async deploy({ account, contract = account, contractDir }) {
    const { api } = this;
    return await deployContract({ api, account, contract, contractDir });
  },

  createAction,

  async sendTransaction(actions) {
    const { api } = this;
    return await sendTransaction({ api, actions });
  },

  createAccount({ account }) {
    const { api } = this;
    return createAccount({ api, account });
  },

  generateAccountName,
};

// const eos = require('eosjs-node').connect({ nodeosUrl: 'http://localhost:7777' })

// eos.deploy();
