const rollup = require('rollup');
const ora = require('ora');
const options = require('./rollup.config');

const spinner = ora(`Electron build...`);

spinner.start();

(async function () {
  try {
    const bundle = await rollup.rollup(options);
    spinner.stop();
    bundle.write(options.output);
    console.log('Electron build success.');
  } catch (err) {
    spinner.stop();
    console.error(err);
  }
})();
