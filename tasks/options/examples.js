module.exports = {
    all: {
        options: {
            base: 'examples',
            excludes: ['_site', 'assets', 'states', 'wip']
        },
        src: ['examples/**/*.js'],
        dest: 'examples/_site/examples.json'
    }
};
