import fetch from 'node-fetch';
import { writeFile } from 'fs';

const args = process.argv;
const id:string = args[2];//"DEV-1292";
const domain:string = args[3];
const username:string = args[4];
const pwd:string = args[5];

fetch(`${domain}/rest/api/3/search?jql=key%3D${id}&expand=changelog`, {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      username+":"+pwd
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
