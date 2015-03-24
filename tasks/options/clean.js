module.exports = {

    docs: ['<%= docs_dir %>/*'],
    build: ['<%= compile_dir %>/*', '<%= modules_dir %>/*.js'],
    release: ['<%= release_dir %>/*.js', '<%= release_dir %>/*.map', '<%= release_custom_dir %>/*'],
    out: ['out']

};
