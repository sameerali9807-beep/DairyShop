const http = require('http');
const { spawn } = require('child_process');
const options = { host: '127.0.0.1', port: 4000, path: '/api/products', method: 'GET', timeout: 2000 };

const req = http.request(options, res => {
  console.log('BACKEND: already running (status ' + res.statusCode + ')');
  process.exit(0);
});

req.on('error', () => {
  try{
    const child = spawn(process.execPath, ['server.js'], { cwd: __dirname + '/../', detached: true, stdio: 'ignore' });
    child.unref();
    console.log('BACKEND: started node server');
  }catch(e){
    console.error('Failed to start server', e);
    process.exit(1);
  }
});

req.on('timeout', () => { req.destroy(); });
req.end();
