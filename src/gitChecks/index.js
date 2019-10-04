const { getRepositoryInfo, getReleaseInfo } = require('./services/gitService');
const { ERROR } = require('./constants');

const limits = require('../constants/limits');

const {
  hasBaseBranches,
  hasBranchProtection,
  averageRequestChanges,
  countBranches,
  pullRequestLifeSpan
} = require('./utils');

const parseRepository = url => url.split('/').filter(elem => elem !== '..' && elem !== '.')[0];

module.exports = async (repository, organization) => {
  const gitData = [];
  const repositoryUrl = parseRepository(repository);
  try {
    const repositoryInfo = await getRepositoryInfo(repositoryUrl, organization);
    gitData.push({
      metric: 'GITHUB',
      description: 'Existen las branches development, stage y master',
      value: hasBaseBranches(repositoryInfo)
    });
    gitData.push({
      metric: 'GITHUB',
      description: 'Las branches estan protegidas',
      value: hasBranchProtection(repositoryInfo)
    });
    const amountOfBranches = countBranches(repositoryInfo);
    if (amountOfBranches > limits.branches) {
      gitData.push({
        metric: 'GITHUB',
        description: 'Demasiadas branches abiertas',
        value: amountOfBranches
      });
    }

    const average = averageRequestChanges(repositoryInfo);
    gitData.push({
      metric: 'GITHUB',
      description: 'Promedio de cambios pedidos por PR',
      value: average
    });

    const pullRequestInfo = await getReleaseInfo(repositoryUrl, organization);
    const { pullRequests, releases } = pullRequestInfo.data.data.repository;
    gitData.push({
      metric: 'GITHUB',
      description: 'Hay un release por cada PR a master',
      value: pullRequests.edges.length <= releases.edges.length
    });
    gitData.push({
      metric: 'GITHUB',
      description: 'Promedio de existencia de PR hasta merge (horas)',
      value: pullRequestLifeSpan(repositoryInfo)
    });
  } catch {
    gitData.push({
      metric: 'GITHUB',
      description: 'Error de git',
      value: ERROR.REPO_NOT_FOUND
    });
  }

  return gitData;
};
