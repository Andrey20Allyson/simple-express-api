// @ts-check
const fs = require('fs/promises');
const path = require('path');

/**
 * @typedef {{
 *  dirs: string[],
 *  log: boolean,
 * }} Config
 */

const ERROR_SYMBOL = Symbol();

/**
 * 
 * @returns {typeof ERROR_SYMBOL}
 */
function ErrorSymbol() {
  return ERROR_SYMBOL;
}

async function main() {
  const {
    dirs,
    log: isLogActived,
  } = await getConfig();

  const log = isLogActived ? console.log : () => { };

  log('Starting the cleaing!');

  await Promise.all(dirs.map(deleteDir));

  log('Cleaning finished with success!');

  return 0;

  /**
   * 
   * @param {string} dir 
   */
  async function deleteDir(dir) {
    const stat = await fs.stat(dir).catch(ErrorSymbol);
    if (stat === ERROR_SYMBOL) return false;

    if (!stat.isDirectory()) return false;

    log(`Deleting directory '${dirs}'`);

    const error = await fs.rm(dir, { force: true, recursive: true }).catch(ErrorSymbol);
    if (error === ERROR_SYMBOL) return false;

    return true;
  }
}

/**
 * @returns {Promise<Config>} 
 */
async function getConfig() {
  const partial = await parseConfigFile();

  return {
    dirs: partial.dirs ?? [],
    log: partial.log ?? false,
  };
}

/**
 * @returns {Promise<Partial<Config>>}
 */
async function parseConfigFile() {
  const data = await fs.readFile('clear.config.json', { encoding: 'utf-8' }).catch(ErrorSymbol);
  if (data === ERROR_SYMBOL) return {};

  return JSON.parse(data);
}

function isMain() {
  const modulePath = path.resolve(__dirname, __filename);
  const mainModulePath = path.resolve(process.argv[1]);

  return modulePath === mainModulePath;
}

if (isMain()) {
  main();
}