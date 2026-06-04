import { existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const projectRoot = process.env.INIT_CWD ?? process.cwd();
const srcDir = new URL('top-level', import.meta.url).pathname;

const files = [
  { src: 'tsconfig.json',        dest: 'tsconfig.json' },
  { src: 'tsconfig.test.json',   dest: 'tsconfig.test.json' },
  { src: 'tsconfig.eslint.json', dest: 'tsconfig.eslint.json' },
  { src: 'eslint.config.js',     dest: 'eslint.config.js' },
  { src: 'prettier.config.js',   dest: 'prettier.config.js' },
];

const alreadyExist = files
  .map(function({ dest: dest }) { return resolve(projectRoot, dest); })
  .filter(function(destPath) { return existsSync(destPath); });

if (alreadyExist.length > 0) {
  console.error('Aborting: the following files already exist:');
  for (const destPath of alreadyExist) {
    console.error('  ' + destPath);
  }
  process.exit(1);
}

for (const { src: src, dest: dest } of files) {
  const srcPath = resolve(srcDir, src);
  const destPath = resolve(projectRoot, dest);

  if (!existsSync(srcPath)) {
    console.error('Missing source: ' + srcPath);
    process.exit(1);
  }

  copyFileSync(srcPath, destPath);
  console.log('Copied ' + src + ' -> ' + dest);
}
