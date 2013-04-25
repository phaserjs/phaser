# grunt-open

Open urls and files from a grunt task

## Installation

Install alongside your Gruntfile

```bash
$ npm install --save grunt-open
```

## Usage

This is immediately useful as part of your task chain between `server` and `watch`

```js
grunt.registerTask('default', 'server open watch');
```

You can specify different configurations so that you can set up task chains like

```js
grunt.registerTask('dev', 'server open:dev watch');
grunt.registerTask('dev', 'build server open:build watch:build');
```

## Getting Started
Install this grunt plugin next to your project's [Gruntfile][getting_started] with: `npm install grunt-open`

## Configuration

This is a very simple task and takes only one configuration parameter, `path`.

```js
grunt.initConfig({
  open : {
    dev : {
      path: 'http://127.0.0.1:8888/src'
    },
    google : {
      path : 'http://google.com/'
    },
    file : {
      path : '/etc/hosts'
    }
  }
})

grunt.loadNpmTasks('grunt-open');

```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

 - 0.2.0 grunt 0.4.0 support, added and preferring `path` parameter.
 - 0.1.0 initial release

## License

Copyright OneHealth Solutions, Inc

Written by Jarrod Overson

Licensed under the Apache 2.0 license.
