var Generator = require('yeoman-generator');
Object.assign(Generator.prototype, require('yeoman-generator/lib/actions/install'));

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    async initPackage() {
        // 可以将 npm init 的交互都问一遍。[Q.直接执行 npm init]
        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname
            }
        ]);

        // Extend or create package.json file in destination path
        const pkgJson = {
            "name": answers.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "devDependencies": {},
            "dependencies": {}
        };

        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

        // 可安最新的版本
        this.npmInstall(["vue"], { "save-dev": false });
        this.npmInstall(['webpack', 'vue-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader'], { 'save-dev': true });

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('dist/index.html'),
            { title: answers.name }
        );
        this.fs.copyTpl(
            this.templatePath('HelloWorld.vue'),
            this.destinationPath('src/HelloWorld.vue')
        );
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
        );
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        );
    }
};