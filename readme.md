# wsfp [![Build Status](https://travis-ci.org/bezoerb/wsfp.svg?branch=master)](https://travis-ci.org/bezoerb/wsfp)

> Set files & folder ACL permissions for webserver user. Based on symfony installation [guide](http://symfony.com/doc/current/book/installation.html#book-installation-permissions) 


## Install

```
$ npm install -g wsfp
```


## Usage

```js
var wsfp = require('wsfp');

wsfp('path/to/cache',function(err){
	
});
```

## Cli

```shell
~$ wsfp app/cache

## API

### wsfp(input, [callback])

#### input

*Required*  
Type: `string`

Filepath or Directory path

## License

MIT © [Ben Zörb](http://sommerlaune.com)
