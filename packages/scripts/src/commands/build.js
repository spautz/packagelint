// Initial experiment: spawning a child process works, but passing along arguments is a bit of a pain,
// and the raw output isn't very pretty
function buildCommand() {
  const path = require('path');

  const tsdxBin = require('tsdx/package.json').bin.tsdx;
  const pathToTsdxBin = require.resolve(path.join('tsdx/', tsdxBin));

  const { spawn } = require('child_process');
  const tsdxBuild = spawn('node', [pathToTsdxBin, 'build']);

  tsdxBuild.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  tsdxBuild.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  tsdxBuild.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

export default buildCommand;
