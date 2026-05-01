const https = require('https');
const options = {
  hostname: 'api.github.com',
  path: '/users/nexovaindustries/repos?per_page=100',
  headers: { 'User-Agent': 'Node.js' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const repos = JSON.parse(data);
      if(repos.map) console.log(repos.map(r => r.name).join('\n'));
      else console.log(data);
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', err => console.error(err));
