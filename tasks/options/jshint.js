module.exports = {
    src: {
        src: [
            'plugins/**/*.js',
            'src/**/*.js',
            '!src/Intro.js',
            '!src/Outro.js',
            '!src/pixi/**/*',
            '!src/physics/p2/p2.js'
        ],
        options: { jshintrc: '.jshintrc' }
    },

    filters: {
        src: ['filters/**/*.js'],
        options: { jshintrc: 'filters/.jshintrc', }
    },

    tooling: {
        src: [
            'Gruntfile.js',
            'tasks/**/*.js'
        ],
        options: { jshintrc: 'tasks/.jshintrc' }
    },

    options: {
        force: true
    }
};
