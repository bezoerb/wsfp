#!/usr/bin/env node
'use strict';
var meow = require('meow');
var os = require('os');
var chalk = require('chalk');
var indentString = require('indent-string');
var wsfp = require('./');
var pkg = require('./package.json');
var updateNotifier = require('update-notifier');

var help = [
	'Usage: wsfp <input>'
].join('\n');

var cli = meow({
	help: help,
	pkg: pkg
});


if (cli.flags['update-notifier'] !== false) {
	updateNotifier({pkg: pkg}).notify();
}

function error(err) {
	process.stderr.write(indentString(chalk.red(err.message || err), '   '));
	process.stderr.write(os.EOL+os.EOL);
	process.stderr.write(indentString(help, '   '));
	process.exit(1);
}

function run() {

	try {
		wsfp(cli.input, function (err) {
			if (err) {
				return error(err);
			}
			process.exit(0);

		});
	} catch (err) {
		error(err);
	}
}

if (cli.input[0]) {
	run();
} else {
	error(new Error('Input missing'))
}
