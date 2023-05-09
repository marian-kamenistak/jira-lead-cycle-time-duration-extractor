import { JiraExtractorConfig } from '../types';

const buildOAuth = (oauthYamlObj) => {
  return {
    consumer_key: oauthYamlObj['Consumer Key'],
    private_key: oauthYamlObj['Private Key'],
    token: oauthYamlObj['Token'],
    token_secret: oauthYamlObj['Token Secret'],
    signature_method: 'RSA-SHA1',
  };
};

const convertToArray = (obj: string[] | string): string[] => {
  if (obj === undefined || obj == null) {
    return [];
  }
  return obj instanceof Array ? obj : [obj];
};

const convertCsvStringToArray = (s: string): string[] => {
  if (s === undefined || s == null) {
    return [];
  } else {
    return s.split(',').map(x => x.trim());
  }
};

const convertYamlToJiraSettings = (config: any): JiraExtractorConfig => {
  const c: JiraExtractorConfig = {};

  c.batchSize = config.BatchSize || 25;
  c.attributes = config.Attributes;
  c.connection = {
    url: config.Connection.Domain || null,
    auth: {
      username: config.Connection.Username || null,
      password: config.Connection.Password || null,
      oauth: buildOAuth(config.Connection) || null,
    }
  };

  c.customJql = config.JQL.Query;

  return c;
};

export {
  convertYamlToJiraSettings,
};