const { spawn } = require('child_process');

console.log('====================================================');
console.log('🚀 Starting MilestoneMate (Server + Client) ...');
console.log('====================================================');

const server = spawn('npm', ['--prefix', 'server', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

const client = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down MilestoneMate services...');
  try { server.kill(); } catch {}
  try { client.kill(); } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

