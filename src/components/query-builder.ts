  export interface QueryBuilderOptions {
    apiRootUrl: string;
    startIndex: number;
    batchSize: number;
    jql: string;
  };
  
  const buildApiUrl = (rootUrl) => `${rootUrl}/rest/api/latest`; 
  
  const buildJiraSearchQueryUrl = ({ apiRootUrl, startIndex, batchSize, jql}: QueryBuilderOptions): string => {
    const query = `${buildApiUrl(apiRootUrl)}/search?jql=${encodeURIComponent(jql)}&startAt=${startIndex}&maxResults=${batchSize}&expand=changelog`;
    return query;
  };
    
  export {
    buildJiraSearchQueryUrl,
  };