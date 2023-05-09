import fetch from 'node-fetch';
import { writeFile } from 'fs';

const id = "DPI-1026";//"DPI-1292";
fetch('https://<jira subdomain>.atlassian.net/rest/api/3/search?jql=key%3D'+id+'&expand=changelog', {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      '<email>:<Jira API Token>'
    ).toString('base64')}`,
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`      
    );
    return response.text();
  })
  .then(text => 
    writeFile(id+'.json', text + '', (err) => {
      if (err) throw err;
    })
  )
  .catch(err => console.error(err));
