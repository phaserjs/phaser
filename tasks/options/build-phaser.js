/*
* Phaser building task configuration settings.
*/

'use strict';


module.exports = {

    //  The standard Phaser build, including p2.js and Phaser Arcade Physics.
    standard: {
        options: {
            filename: 'phaser',
            sourcemap: true,
            excludes: [ 'ninja', 'creature' ],
            copy: true,
            copyCustom: false
        }
    },

    //  A custom build including only Phaser Arcade Physics.
    arcadephysics: {
        options: {
            filename: 'phaser-arcade-physics',
            sourcemap: true,
            excludes: [ 'ninja', 'p2', 'creature' ],
            copy: true,
            copyCustom: true
        }
    },

    //  A light custom build, including only basic support, with no physics
    //  systems support and no tilemaps.
    nophysics: {
        options: {
            filename: 'phaser-no-physics',
            sourcemap: true,
            excludes: [ 'arcade', 'ninja', 'p2', 'tilemaps', 'arcadetilemaps', 'particles', 'creature' ],
            copy: true,
            copyCustom: true
        }
    },

    //  A lighter custom build, including only the minimum required Phaser
    //  modules.
    minimum: {
        options: {
            filename: 'phaser-minimum',
            sourcemap: true,
            excludes: [ 'gamepad', 'keyboard', 'bitmapdata', 'graphics', 'rendertexture', 'text', 'bitmaptext', 'retrofont', 'net', 'tweens', 'sound', 'debug', 'arcade', 'ninja', 'p2', 'tilemaps', 'arcadetilemaps', 'particles', 'creature', 'video' ],
            copy: true,
            copyCustom: true
        }
    },

    //  Full version of Phaser, including all modules.
    full: {
        options: {
            filename: 'phaser-full',
            sourcemap: true,
            excludes: [],
            copy: true,
            copyCustom: true
        }
    },

    //  Required by npm's `prepublish` hook. Same as the 'standard' preset.
    prepublish: {
        options: {
            filename: 'phaser',
            sourcemap: true,
            excludes: [ 'ninja', 'creature' ],
            copy: false,
            copyCustom: false
        }
    }

};
