# Examples

```js
// Simple config to run jshint any time a file is added, changed or deleted
grunt.initConfig({
  watch: {
    files: '**/*',
    tasks: ['jshint']
  }
});
```

```js
// Advanced config. Run specific tasks when specific files are added, changed or deleted.
grunt.initConfig({
  watch: {
    gruntfile: {
      files: 'Gruntfile.js',
      tasks: ['jshint:gruntfile'],
      options: {
        nocase: true
      }
    },
    src: {
      files: ['lib/*.js', 'css/**/*.scss', '!lib/dontwatch.js'],
      tasks: ['default']
    },
    test: {
      files: '<%= jshint.test.src %>',
      tasks: ['jshint:test', 'qunit']
    }
  }
});
```

```js
// Example using watch events
grunt.initConfig({
  watch: {
    scripts: {
      files: ['lib/*.js']
    }
  }
});

// Listen for events when files are modified
grunt.event.on('watch', function(action, filepath) {
  grunt.log.writeln(filepath + ' has ' + action);
});
```

# FAQs

## How do I fix the error `EMFILE: Too many opened files.`?
This is because of your system's max opened file limit. For OSX the default is very low (256). Temporarily increase your limit with `ulimit -n 10480`, the number being the new max limit.

## Can I use this with Grunt v0.3?
Yes. Although `grunt-contrib-watch` is a replacement watch task for Grunt v0.4, version `grunt-contrib-watch@0.1.x` is compatible with Grunt v0.3. `grunt-contrib-watch >= 0.2.x` is **only* compatible and recommended to use with Grunt v0.4.

## Why is the watch devouring all my memory?
Likely because of an enthusiastic pattern trying to watch thousands of files. Such as `'**/*.js'` but forgetting to exclude the `node_modules` folder with `'!node_modules/**/*.js'`. Try grouping your files within a subfolder or be more explicit with your file matching pattern.

## Why spawn as child processes as a default?
The goal of this watch task is as files are changed, run tasks as if they were triggered by the user themself. Each time a user runs `grunt` a process is spawned and tasks are ran in succession. In an effort to keep the experience consistent and continualy produce expected results, this watch task spawns tasks as child processes by default.

Sandboxing task runs also allows this watch task to run more stable over long periods of time. As well as more efficiently with more complex tasks and file structures.

Spawning does cause a performance hit (usually 500ms for most environments). It also cripples tasks that rely on the watch task to share the context with each subsequent run (i.e., reload tasks). If you would like a faster watch task or need to share the context please set the `nospawn` option to `true`. Just be aware that with this option enabled, the watch task is more prone to failure.
