var Generator = require('yeoman-generator');
Object.assign(Generator.prototype, require('yeoman-generator/lib/actions/install'));

// 简单的命令行交互
module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // // Next, add your custom code
        // this.option('babel'); // This method adds support for a `--babel` flag
    }
    // 会顺次执行里面的方法
    method1() {
        this.log('method 1 just ran');
    }

    method2() {
        this.log('method 2 just ran');
    }
    async prompting() {
        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            },
            {
                type: "confirm",
                name: "cool",
                message: "Would you like to enable the Cool feature?"
            }
        ]);

        this.log("app name", answers.name);
        this.log("cool feature", answers.cool);
    }
    writing() {
        this.log('method writing is running.')
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }
        );
        this.log('method writing has run.')
    }
    initPackage() {
        // Extend or create package.json file in destination path
        const pkgJson = {
            devDependencies: {
                eslint: '^3.15.0'
            },
            dependencies: {
                react: '^16.2.0'
            }
        };
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

        // https://stackoverflow.com/questions/68265615/yeoman-this-npminstall-is-not-a-function
        this.npmInstall();

        // this.packageJson.merge({
        //     dependencies: {
        //         react: '^16.2.0'
        //     },
        //     devDependencies: {
        //         eslint: '^3.15.0'
        //     }
        // });
    }
};