const rollup = require('rollup');
const waitOn = require('wait-on');
const options = require('./rollup.config');

const electron = require('electron-connect').server.create({
  stopOnClose: true
});

const watch = function () {
  const watcher = rollup.watch(options);
  watcher.on('event', (evt) => {
    if (evt.code === 'END') {
      electron.electronState === 'init' ? electron.start() : electron.restart();
    } else if (evt.code === 'ERROR') {
      console.log(evt.error);
    }
  });
};

const resource = `http://localhost:${process.env.PORT || 3000}/index.html`;

waitOn(
  {
    resources: [resource],
    timeout: 5000
  },
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    watch();
  }
);
