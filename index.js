const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');


async function run() {

  try {
    
    let version = core.getInput('version');
    let downloadURL = core.getInput('download_url');

    const fillTemplate = function(s) {
      s = s.replace(/\$\{version\}/g, version)
      return s
    }
    
    downloadURL = fillTemplate(downloadURL);
    core.info(`samo donwload URL: ${downloadURL}`)
    
    await installTool(version, downloadURL);    
    await exec.exec('samo version');
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function installTool(version, url) {
  let cachedPath = tc.find('samo', version)
  if (cachedPath) {
      core.addPath(cachedPath)
      return
  }

  const file = await tc.downloadTool(url);

  await exec.exec(`rm -rf samo`)
  await exec.exec(`mkdir samo`)
  await exec.exec(`tar -C samo -xzvf ${file} --strip-components 0 --wildcards samo`)

  cachedPath = await tc.cacheDir('samo', 'samo', version);
  core.addPath(cachedPath)
}

run();
