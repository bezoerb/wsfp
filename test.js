'use strict';
var expect = require('chai').expect;
var wsfp = require('./');
var fs = require('fs');




describe('Module', function(){
	beforeEach(function(){
		fs.mkdirSync('dummy');
		fs.writeFileSync('dummy/test','lorem ipsum');
	});
	afterEach(function(){
		fs.unlinkSync('dummy/test');
		fs.rmdirSync('dummy');
	});

	it('should set folder rights', function (done) {
		wsfp(['dummy','dummy/test'], function(err){

			if (process.platform === 'win32') {
				expect(err).to.exist;
			} else {
				expect(err).to.not.exist;
			}

			done();
		});

	});
});


