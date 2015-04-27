'use strict';
var exec = require('child_process').exec;
var chalk = require('chalk');
var os = require('os');

module.exports = function (paths, cb) {
	if (typeof paths === 'string') {
		paths = [paths];
	}

	if (!cb) {
		cb = function(){};
	}

	if (process.platform === 'win32') {
		cb(new Error('ACL is not supported on Windows'));
	}

	var acl = {
		// Use ACL on a system that does support chmod +a
		chmod: [
			'HTTPDUSER=`ps aux | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
			'chmod +a "$HTTPDUSER allow delete,write,append,file_inherit,directory_inherit" ' + paths.join(' '),
			'chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" ' + paths.join(' ')
		],

		// Use ACL on a system that does not support chmod +a
		setfacl: [
			'HTTPDUSER=`ps aux | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
			'setfacl -R -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX ' + paths.join(' '),
			'setfacl -dR -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX ' + paths.join(' ')
		]
	};

	exec(acl.chmod.join(';'), [], function (err, stdout, stderr) {
		if (!err) {
			return cb();
		} else if (/not\spermitted/.test(stderr)) {
			return cb(new Error(chalk.bold.red('Warning: ') + 'Failed setting the folder permissions. Retry with root permissions'));
		}

		exec(acl.setfacl.join(';'), [], function (err, stdout, stderr) {
			if (!err) {
				return cb();
			} else if (/not\spermitted/.test(stderr)) {
				return cb(new Error(chalk.bold.red('Warning: ') + 'Failed setting the folder permissions. Retry with root permissions'));
			}

			cb(new Error('Your system doesn\'t support ACL'));

		});
	});
};
