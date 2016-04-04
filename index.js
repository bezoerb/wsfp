'use strict';
var exec = require('child_process').exec;
var fs = require('fs');
var chalk = require('chalk');

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

	// filter non existing paths
	paths.forEach(function(p, index){
		try {
			fs.statSync(p);
		} catch (err) {

			cb(new Error(chalk.bold.red('Warning: ') + err.message.replace(/,\s*stat\s*(.*$)/,': $1')));
		}
	});

	if (!paths.length) {
		cb(new Error('Missing valid input'));
	}

	var acl = {
		// Use ACL on a system that does support chmod +a
		chmod: [
			'HTTPDUSER=`ps axo user,comm | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
			'chmod -R +a "$HTTPDUSER allow delete,write,append,file_inherit,directory_inherit" ' + paths.join(' '),
			'chmod -R +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" ' + paths.join(' ')
		],

		// Use ACL on a system that does not support chmod +a
		setfacl: [
			'HTTPDUSER=`ps axo user,comm | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
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
