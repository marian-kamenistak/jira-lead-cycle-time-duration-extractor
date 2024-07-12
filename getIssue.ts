import fetch from 'node-fetch';
import { writeFile } from 'fs';

const args = process.argv;
const id:string = args[2];//"DEV-1292";
const domain:string = args[3].substr(args[3].length - 1) === "/" ? args[3].substring(0, args[3].length - 1) : args[3];
const username:string = args[4];
const pwd:string = args[5];

//fetch(`${domain}/rest/api/3/search?jql=key%3D${id}&expand=changelog`, { // cloud
fetch(`${domain}/rest/api/latest/search?jql=key%3D${id}&expand=changelog`, { // server
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${pwd}`
    /*
    'Authorization': `Basic ${Buffer.from(
      username+":"+pwd
    ).toString('base64')}`
    */,
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
