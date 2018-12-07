'use strict';

const Random = require('random-js');

module.exports = {
  generateAccountName() {
    const random = new Random();
    const allowed = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      1,
      2,
      3,
      4,
      5,
    ];

    return random.sample(allowed, 12).join('');
  },
};
