const chalk = require('chalk');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  /**
   * Create a welcome message using yosay
   */
  initializing() {
    this.log(yosay(`Welcome to the ${chalk.yellow('NodeJS-TS Semantic generator')}`));
  }

  /**
   * User interaction
   */
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: `What will be your package name? (default: current folder name ${this.appname})`,
        default: this.appname,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Add a little description for your NPM package',
      },
      {
        type: 'confirm',
        name: 'wantsSonarQube',
        message: 'Do you want to add sonarqube to your module? (y/N)',
      },
    ]);

    this.log(`Your package's name: ${this.answers.name}`);
  }

  /**
   * Fill templates and add files
   */
  writing() {
    /**
     * Fill the package.json file
     */
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
      name: this.answers.name,
      description: this.answers.description,
    });

    /**
     * Add a .gitignore file
     */
    this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));

    /**
     * Add a prettier
     */
    this.fs.copy(this.templatePath('_.prettierrc.yaml'), this.destinationPath('.prettierrc.yaml'));

    /**
     * Add sonarqube if the user wants it
     */
    this.fs.copyTpl(this.templatePath('_.releaserc.json'), this.destinationPath('.releaserc.json'), {
      hasSonarQube: this.answers.wantsSonarQube,
    });
    if (this.answers.wantsSonarQube) {
      this.fs.copy(this.templatePath('_bumpSonarQube.js'), this.destinationPath('bumpSonarQube.js'));
      this.fs.copyTpl(
        this.templatePath('_sonar-project.properties'),
        this.destinationPath('sonar-project.properties'),
        {
          name: this.answers.name,
        },
      );
    }

    /**
     * Add ts configuration
     */
    this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('_tslint.json'), this.destinationPath('tslint.json'));
  }

  /**
   * Add required dependencies
   */
  install() {
    this.npmInstall(
      [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        '@semantic-release/commit-analyzer',
        '@semantic-release/git',
        '@yelloan/tslint',
        'commitizen',
        'cz-conventional-changelog',
        'husky',
        'lint-staged',
        'prettier',
        'semantic-release',
        'ts-node',
        'tslint',
        'tslint-config-prettier',
        'typescript',
      ],
      {
        'save-dev': true,
      },
    );

    /**
     * Install exec and shelljs if SonarQube has been chosen
     */
    if (this.answers.wantsSonarQube) {
      this.npmInstall(['@semantic-release/exec', 'shelljs'], {
        'save-dev': true,
      });
    }
  }

  /**
   * End of the script
   * Install dependencies
   */
  end() {
    this.log('Thank you! I will now install all dependencies');
  }
};
