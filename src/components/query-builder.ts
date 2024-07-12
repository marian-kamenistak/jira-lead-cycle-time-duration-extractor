  export interface QueryBuilderOptions {
    apiRootUrl: string;
    startIndex: number;
    batchSize: number;
    jql: string;
  };
  
  const buildApiUrl = (rootUrl:string) => {
    rootUrl = rootUrl.substr(rootUrl.length - 1) === "/" ? rootUrl.substring(0, rootUrl.length - 1) : rootUrl;
    return `${rootUrl}/rest/api/latest`; 
  }
  
  const buildJiraSearchQueryUrl = ({ apiRootUrl, startIndex, batchSize, jql}: QueryBuilderOptions): string => {
    const query = `${buildApiUrl(apiRootUrl)}/search?jql=${encodeURIComponent(jql)}&startAt=${startIndex}&maxResults=${batchSize}&expand=changelog`;
    return query;
  };
    
  export {
    buildJiraSearchQueryUrl,
  };