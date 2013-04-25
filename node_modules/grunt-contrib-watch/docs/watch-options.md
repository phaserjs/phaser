# Settings

There are a number of options available. Please review the [minimatch options here](https://github.com/isaacs/minimatch#options). As well as some additional options as follows:

## files
Type: `String|Array`

This defines what file patterns this task will watch. Can be a string or an array of files and/or minimatch patterns.

## tasks
Type: `String|Array`

This defines which tasks to run when a watched file event occurs.

## options.nospawn
Type: `Boolean`
Default: false

This instructs the watch task to not spawn task runs in a child process. Setting this option also speeds up the reaction time of the watch (usually 500ms faster for most) and allows subsequent task runs to share the same context (i.e., using a reload task). Not spawning task runs can make the watch more prone to failing so please use as needed.

Example:
```js
watch: {
  scripts: {
    files: ['**/*.js'],
    tasks: ['livereload'],
    options: {
      nospawn: true
    }
  }
}
```

## options.interrupt
Type: `Boolean`
Default: false

As files are modified this watch task will spawn tasks in child processes. The default behavior will only spawn a new child process per target when the previous process has finished. Set the `interrupt` option to true to terminate the previous process and spawn a new one upon later changes.

Example:
```js
watch: {
  scripts: {
    files: '**/*.js',
    tasks: ['jshint'],
    options: {
      interrupt: true
    }
  }
}
```

## options.debounceDelay
Type: `Integer`
Default: 500

How long to wait before emitting events in succession for the same filepath and status. For example if your `Gruntfile.js` file was `changed`, a `changed` event will only fire again after the given milliseconds.

Example:
```js
watch: {
  scripts: {
    files: '**/*.js',
    tasks: ['jshint'],
    options: {
      debounceDelay: 250
    }
  }
}
```

## options.interval
Type: `Integer`
Default: 100

The `interval` is passed to `fs.watchFile`. Since `interval` is only used by `fs.watchFile` and this watcher also uses `fs.watch`; it is recommended to ignore this option. *Default is 100ms*.
