const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');

describe('Testing the generator', () => {
  it('should create a package.json file with name and description filled', async () => {
    const appName = 'my-test-app';
    const appDescription = 'My test app';
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: appName, description: appDescription });

    assert.fileContent('package.json', /"name": "my-test-app"/);
    assert.fileContent('package.json', /"description": "My test app"/);
    assert.file('.prettierrc.yaml');
  });
});
