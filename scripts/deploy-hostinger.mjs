// Prepara el deploy a Hostinger: deja el contenido de dist/ (y nada más) en la rama "hostinger".
// hPanel → Git copia la rama entera a public_html, por eso esa rama no lleva src/, CLAUDE.md ni nginx.conf.
//
// Uso:
//   npm run deploy:hostinger            build + commit en la rama hostinger (local, no sube nada)
//   npm run deploy:hostinger -- --push  además hace git push origin hostinger (después: "Implementar" en hPanel)
//   --no-build                          usa el dist/ que ya está
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BRANCH = 'hostinger';
const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const args = process.argv.slice(2);
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

if (!args.includes('--no-build')) {
  console.log('▶ npm run build');
  execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
}
for (const required of ['index.html', '.htaccess']) {
  if (!existsSync(join(dist, required))) throw new Error(`Falta dist/${required}: corré el build`);
}

const sourceSha = git(root, 'rev-parse', '--short', 'HEAD');
const sourceBranch = git(root, 'rev-parse', '--abbrev-ref', 'HEAD');
const dirty = git(root, 'status', '--porcelain', '--', 'src', 'public', 'astro.config.mjs', 'package.json');
if (dirty) console.warn('⚠ Hay cambios sin commitear en src/ o public/: el deploy no va a coincidir con ningún commit.');

// Carpeta temporal con la rama hostinger (se crea huérfana, sin historia del código, la primera vez)
const work = mkdtempSync(join(tmpdir(), 'vive-hostinger-'));
const hasLocal = git(root, 'branch', '--list', BRANCH) !== '';
const hasRemote = (() => { try { return git(root, 'ls-remote', '--heads', 'origin', BRANCH) !== ''; } catch { return false; } })();
try {
  if (hasLocal) git(root, 'worktree', 'add', work, BRANCH);
  else if (hasRemote) git(root, 'worktree', 'add', '-b', BRANCH, work, `origin/${BRANCH}`);
  else {
    git(root, 'worktree', 'add', '--detach', work);
    git(work, 'checkout', '--orphan', BRANCH);
    git(work, 'rm', '-rf', '--quiet', '.');
  }

  // Reemplaza todo por el dist/ actual
  for (const entry of readdirSync(work)) if (entry !== '.git') rmSync(join(work, entry), { recursive: true, force: true });
  cpSync(dist, work, { recursive: true });

  git(work, 'add', '-A');
  if (!git(work, 'status', '--porcelain')) {
    console.log(`✔ La rama ${BRANCH} ya tiene este build. Nada para commitear.`);
  } else {
    git(work, 'commit', '-m', `deploy: build de ${sourceBranch}@${sourceSha}`);
    console.log(`✔ Commit en la rama ${BRANCH}: ${git(work, 'log', '-1', '--format=%h %s')}`);
  }

  if (args.includes('--push')) {
    git(work, 'push', 'origin', BRANCH);
    console.log(`✔ Subido a origin/${BRANCH}. En hPanel → Avanzado → Git → "Implementar" (o deploy automático).`);
  } else {
    console.log(`  Para subirlo: npm run deploy:hostinger -- --no-build --push  (o git push origin ${BRANCH})`);
  }
} finally {
  git(root, 'worktree', 'remove', '--force', work);
}
