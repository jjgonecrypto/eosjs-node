'use strict';

// code from
// https://github.com/MrToph/generator-eos/blob/2.4.0/generators/app/templates/utils/deploy.js

const fs = require('fs');
const path = require('path');
const { Serialize } = require('eosjs');
const { sendTransaction, getErrorDetail, createAction } = require('./transact');

function getDeployableFilesFromDir(contract, dir) {
  const pathTo = ext => path.join(dir, `${contract}.${ext}`);
  ['wasm', 'abi'].forEach(ext => {
    const file = pathTo(ext);
    if (!fs.existsSync(file)) throw new Error(`Cannot find ${file}`);
  });

  return {
    wasmPath: pathTo('wasm'),
    abiPath: pathTo('abi'),
  };
}

const EOSIO_SYSTEM_ACCOUNT = 'eosio';

async function deployContract({ api, account, contract, contractDir }) {
  const { wasmPath, abiPath } = getDeployableFilesFromDir(contract, contractDir);
  const wasm = fs.readFileSync(wasmPath).toString('hex');

  const setCodeAction = createAction({
    account: EOSIO_SYSTEM_ACCOUNT,
    name: 'setcode',
    actor: account,
    data: {
      account,
      vmtype: 0,
      vmversion: 0,
      code: wasm,
    },
  });

  try {
    await sendTransaction({ api, actions: setCodeAction });

    console.log(`Contract updated ${wasmPath}`);
  } catch (error) {
    console.error('setcode failed:', getErrorDetail(error));
  }

  try {
    const buffer = new Serialize.SerialBuffer({
      textEncoder: api.textEncoder,
      textDecoder: api.textDecoder,
    });

    let abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const abiDefinition = api.abiTypes.get('abi_def');
    // need to make sure abi has every field in abiDefinition.fields
    // otherwise serialize throws
    abi = abiDefinition.fields.reduce(
      (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
      abi
    );
    abiDefinition.serialize(buffer, abi);

    const setABIAction = createAction({ account: EOSIO_SYSTEM_ACCOUNT,
      name: 'setabi',
      actor: account,
      data: {
        account,
        abi: Buffer.from(buffer.asUint8Array()).toString('hex'),
      }});
    await sendTransaction({ api, actions: setABIAction });
    console.log(`ABI updated ${abiPath}`);
  } catch (error) {
    console.error('setabi failed:', getErrorDetail(error));
  }
}

module.exports = {
  deployContract,
};
