/* eslint-disable no-console */
const fs = require('fs');
const { find } = require('find-in-files');
const { red, green } = require('../constants/colors');

const { analyzeMatches } = require('../utils');

const VALID_ENVS = ['.development', '.stage', '.master'];

module.exports = testPath => {
  VALID_ENVS.forEach(elem =>
    fs.access(`${testPath}/.env${elem}`, fs.F_OK, err => {
      if (err) {
        console.log(red, `No existe un archivo .env${elem}`);
      } else {
        console.log(green, `Existe un archivo .env${elem}`);
      }
    })
  );
  find('process.env.', testPath, '.js$').then(results => {
    if (analyzeMatches(results).length) {
      console.log(green, 'Se utiliza un .env en el proyecto');
    } else {
      console.log(red, 'No se esta utilizando ningun .env en el proyecto');
    }
  });
  if (!fs.existsSync(`${testPath}/aws.js`)) {
    console.log(red, 'No existe aws.js en el root del proyecto');
  }
};
