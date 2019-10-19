const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');

describe('Testing the generator', () => {
  it('should create a new module with SonarQube', async () => {
    const appName = 'my-test-app';
    const appDescription = 'My test app';
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: appName, description: appDescription, wantsSonarQube: true });

    assert.fileContent('package.json', /"name": "my-test-app"/);
    assert.fileContent('package.json', /"description": "My test app"/);
    assert.file('.prettierrc.yaml');
    assert.fileContent('sonar-project.properties', /sonar.projectKey=my-test-app/);
    assert.fileContent('sonar-project.properties', /sonar.projectName=my-test-app/);
    assert.fileContent('.releaserc.json', /"prepareCmd": "node bumpSonarQube.js"/);
    assert.file('bumpSonarQube.js');
    assert.file('tsconfig.json');
    assert.file('tslint.json');
  });

  it('should create a new module without SonarQube', async () => {
    const appName = 'my-test-app';
    const appDescription = 'My test app';
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: appName, description: appDescription, wantsSonarQube: false });

    assert.fileContent('package.json', /"name": "my-test-app"/);
    assert.fileContent('package.json', /"description": "My test app"/);
    assert.file('.prettierrc.yaml');
    assert.noFile('sonar-project.properties');
    assert.noFile('sonar-project.properties');
    assert.noFileContent('.releaserc.json', /"prepareCmd": "node bumpSonarQube.js"/);
    assert.noFile('bumpSonarQube.js');
    assert.file('tsconfig.json');
    assert.file('tslint.json');
  });
});
