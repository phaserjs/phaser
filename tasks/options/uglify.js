
module.exports = {

    custom: {

        options: {
            sourceMap: '<%= sourcemap %>',
            sourceMapName: '<%= compile_dir %>/<%= filename %>.map',
            banner: '/* Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */\n'
        },

        src: ['<%= concat.custom.dest %>'],
        dest: '<%= compile_dir %>/<%= filename %>.min.js'

    }

};
