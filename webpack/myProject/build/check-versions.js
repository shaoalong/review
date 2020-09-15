'use strict'
/**
 * 检测设备上的相关工具版本是否满足项目要求，目前需要检测的是npm和nodejs的版本
 *
 */
var shell = require('shelljs');
var chalk = require('chalk');
if(!shell.which('npm')) {
  console.log(chalk.red('设备未安装npm,请安装后再运行命令'));
  process.exit();
}

var childProc = require('child_process');
function exec (cmd) {
  return childProc.execSync(cmd).toString().trim();
}

var semver = require('semver');
var npmConfig = require('../package.json');
var requirements = [
  {
    name: 'node',
    curVersion: semver.clean(process.version),
    requiredVersion: npmConfig.engines.node
  },
  {
    name: 'npm',
    curVersion: exec('npm -v'),
    requiredVersion: npmConfig.engines.npm
  }
];

module.exports = function() {
  var errs = [];
  requirements.forEach(function(rq) {
    var errMsg = rq.name + ':' + chalk.red(rq.curVersion) + '应该为' + chalk.green(rq.requiredVersion);
    !semver.satisfies(rq.curVersion, rq.requiredVersion)
      && errs.push(errMsg);
  });
  if(errs.length) {
    var preMsg = chalk.yellow('为了能够正常的使用本框架，必须要将下面的模块更新到以下版本：')
    console.log();
    console.log(preMsg);
    errs.forEach(function(msg) {
      console.log(' ' + msg);
    });
    console.log();
    process.exit();
  }
}
