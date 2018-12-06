'use strict';

const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');
const { Api, JsonRpc, JsSignatureProvider } = require('eosjs');

require('dotenv').config({ path: '../.required.env' });
const { EOS_CHAIN_ID, EOSIO_PRIVATE_KEY } = process.env;

const { deployContract } = require('./lib/deploy');
const { createAction, sendTransaction } = require('./lib/util');
const { createAccount } = require('./lib/account');

module.exports = {
  connect({ nodeosUrl }) {
    const signatureProvider = new JsSignatureProvider([EOSIO_PRIVATE_KEY]);

    const rpc = new JsonRpc(nodeosUrl, { fetch });
    const api = new Api({
      rpc,
      signatureProvider,
      chainId: EOS_CHAIN_ID,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    return Object.assign({ api }, module.exports);
  },

  deploy({ account, contract = account, contractDir }) {
    const { api } = this;
    return deployContract({ api, account, contract, contractDir });
  },

  createAction,

  sendTransaction(actions) {
    const { api } = this;
    return sendTransaction({ api, actions });
  },

  createAccount({ account }) {
    const { api } = this;
    return createAccount({ api, account });
  }
};




// const eos = require('eosjs-node').connect({ nodeosUrl: 'http://localhost:7777' })

// eos.deploy();
