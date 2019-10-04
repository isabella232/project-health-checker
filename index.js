require('dotenv').config();
const parseArgs = require('minimist');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');

const runBuildChecks = require('./src/buildChecks');

const { green } = require('./src/constants/colors');
const writeSpreadSheet = require('./src/utils/writeSheet');
const frontendChecks = require('./src/frontEnd');

const techs = {
  react: frontendChecks,
  angular: frontendChecks,
  vue: frontendChecks,
  node: require('./src/backEnd/nodeChecks')
};

const args = parseArgs(process.argv);

let testPath = '';
let techChecks = 'react';
let organization = 'Wolox';
let seoLink = undefined;

if (args.path) {
  testPath = args.path;
} else if (args.p) {
  testPath = args.p;
}

if (args.link) {
  seoLink = args.link;
} else if (args.l) {
  seoLink = args.l;
}

if (args.tech) {
  techChecks = args.tech;
} else if (args.t) {
  techChecks = args.t;
}

const repoName = testPath;

if (args.org) {
  organization = args.org;
} else if (args.o) {
  organization = args.o;
}

async function executeChecks() {
  let gitData = [];
  let envData = [];
  let generalData = [];
  let techData = [];
  let buildData = [];
  console.log(green, 'Comenzando auditoria...');
  envData = await runEnvChecks(testPath);
  console.log(green, 'Chequeos de env terminados con exito ✓');
  generalData = await runGeneralChecks(testPath);
  console.log(green, 'Chequeos generales terminados con exito ✓');
  gitData = await runGitChecks(repoName, organization);
  console.log(green, 'Chequeos de github terminados con exito ✓');
  techData = await techs[techChecks](testPath, techChecks, seoLink);
  console.log(green, 'Chequeos de tecnologia terminados con exito ✓');
  buildData = await runBuildChecks(testPath);
  return [...envData, ...generalData, ...gitData, ...techData, ...buildData];
}

async function executeAudit() {
  const reports = await executeChecks();
  console.log(green, 'Chequeos terminados con exito ✓');
  console.log(green, 'Cargando Spreadsheet...');
  writeSpreadSheet(reports, testPath);
}

executeAudit();
