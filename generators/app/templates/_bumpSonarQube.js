'use strict';

const fs = require('fs');
const promisify = require('util').promisify;
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

const bumpAppVersion = async function() {
  /**
   * Read Sonar properties file
   */
  const sonarFile = await readFileP('sonar-project.properties', 'utf8');

  /**
   * Get the current package version and upgrade it to the next minor release
   */
  const pkgVersion = require('./package.json').version.trim();

  /**
   * Replace in sonar-project.properties file the "projectVersion" line with the latest version
   */
  const sonarFileReplaced = sonarFile.replace(/sonar\.projectVersion=.*/, `sonar.projectVersion=${pkgVersion}`);
  await writeFileP('sonar-project.properties', sonarFileReplaced, 'utf8');
};

return bumpAppVersion().catch((err) => {
  console.error(err);
  process.exit(1);
});
