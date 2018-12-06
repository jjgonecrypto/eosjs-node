'use strict';

// code extrapolated from
// https://github.com/MrToph/generator-eos/blob/2.4.0/generators/app/templates/utils/others.js

const util = require('util');

const createAction = ({
  account,
  name,
  actor,
  data = {},
}) => ({
  account,
  name,
  authorization: [
    {
      actor,
      permission: 'active',
    },
  ],
  data,
});

const sendTransaction = async ({ api, actions }) => {
  actions = Array.isArray(actions) ? actions : [actions];
  return api.transact(
    {
      actions
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
};

const getErrorDetail = error => {
  try {
    const json = typeof error === 'string' ? JSON.parse(error) : JSON.parse(error.message);
    return json.error.details[0].message;
  } catch (e) {
    if (typeof error.json === 'undefined') return red(error);
    const { message, error: { code, name, what, details } = {} } = error.json;
    return message + (name ? `. ${name} (${code}): ${what}. \n${util.inspect(details)}` : '');
  }
};

module.exports = {
  createAction,
  sendTransaction,
  getErrorDetail,
};
