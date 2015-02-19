
module.exports = {

    custom: {

        options: {
            banner: '/* Phaser (custom) v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */\n'
        },

        src: ['<%= concat.custom.dest %>'],
        dest: '<%= compile_dir %>/phaser-custom.min.js'

    }

};
