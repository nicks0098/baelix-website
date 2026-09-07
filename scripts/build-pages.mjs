import { access, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const projectDirectory = new URL('..', import.meta.url);
const outputDirectory = new URL('../dist/client/', import.meta.url);
const homepage = new URL('index.html', outputDirectory);
const deployRedirect = new URL('../.wrangler/deploy/', import.meta.url);

await rm(outputDirectory, { recursive: true, force: true });
await rm(deployRedirect, { recursive: true, force: true });

const command = process.platform === 'win32'
  ? 'node_modules\\.bin\\vinext.cmd'
  : 'node_modules/.bin/vinext';

const build = spawnSync(command, ['build'], {
  cwd: projectDirectory,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

let homepageExists = true;
try {
  await access(homepage);
} catch {
  homepageExists = false;
}

if (!homepageExists) {
  console.error('Cloudflare Pages build failed: dist/client/index.html was not created.');
  process.exit(build.status || 1);
}

// Vinext writes a temporary Worker deployment redirect. It is useful for
// `vinext start`, but Cloudflare Pages must publish the static client folder.
await rm(deployRedirect, { recursive: true, force: true });

if (build.status && process.platform !== 'win32') {
  process.exit(build.status);
}

console.log('Cloudflare Pages artifact verified: dist/client/index.html');
