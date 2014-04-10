
module.exports = {
    p2: {
        options: {
            banner: '/* p2.js custom build for Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.p2.dest %>'],
        dest: '<%= compile_dir %>/p2.min.js'
    },

    pixi: {
        options: {
            banner: '/* Pixi.js custom build for Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.pixi.dest %>'],
        dest: '<%= compile_dir %>/pixi.min.js'
    },

    ninja: {
        options: {
            banner: '/* Ninja Physics for Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.ninja.dest %>'],
        dest: '<%= compile_dir %>/ninja.min.js'
    },

    phaser: {
        options: {
            banner: '/* Phaser (no libs) v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.phaser.dest %>'],
        dest: '<%= compile_dir %>/phaser-no-libs.min.js'
    },

    phaserArcadePhysics: {
        options: {
            banner: '/* Phaser (AP) v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.phaserArcadePhysics.dest %>'],
        dest: '<%= compile_dir %>/phaser-arcade-physics.min.js'
    },

    standalone: {
        options: {
            sourceMap: true,
            sourceMapName: '<%= compile_dir %>/phaser.map',
            banner: '/* Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= concat.standalone.dest %>'],
        dest: '<%= compile_dir %>/phaser.min.js'
    }
};
