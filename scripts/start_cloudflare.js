const fs = require('fs');
const https = require('https');
const path = require('path');
const { spawn } = require('child_process');

const exePath = path.resolve('cloudflared.exe');

async function downloadCloudflared() {
  if (fs.existsSync(exePath) && fs.statSync(exePath).size > 10000000) {
    console.log('cloudflared.exe already exists, launching...');
    runCloudflared();
    return;
  }

  console.log('Downloading official Cloudflare tunnel binary...');
  const url = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe';

  function get(url) {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location);
      }
      const file = fs.createWriteStream(exePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Download complete. Launching Cloudflare Tunnel...');
          runCloudflared();
        });
      });
    }).on('error', (err) => {
      console.error('Download error:', err);
    });
  }

  get(url);
}

function runCloudflared() {
  const child = spawn(exePath, ['tunnel', '--url', 'http://localhost:3000'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log('CLOUDFLARE_URL:', match[0]);
    }
  });

  child.stdout.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log('CLOUDFLARE_URL:', match[0]);
    }
  });

  child.on('close', (code) => {
    console.log('cloudflared exited with code', code);
  });
}

downloadCloudflared();
