module.exports = {
    main: {
        files: [
            { src: ['dist/phaser.js'], dest: 'build/phaser.js' },
            { src: ['dist/phaser.min.js'], dest: 'build/phaser.min.js' },
            { src: ['dist/phaser.map'], dest: 'build/phaser.map' },

            { src: ['dist/p2.js'], dest: 'build/custom/p2.js' },
            { src: ['dist/p2.min.js'], dest: 'build/custom/p2.min.js' },

            { src: ['dist/phaser-no-libs.js'], dest: 'build/custom/phaser-no-libs.js' },
            { src: ['dist/phaser-no-libs.min.js'], dest: 'build/custom/phaser-no-libs.min.js' },

            { src: ['dist/pixi.js'], dest: 'build/custom/pixi.js' },
            { src: ['dist/pixi.min.js'], dest: 'build/custom/pixi.min.js' },

            { src: ['dist/ninja.js'], dest: 'build/custom/ninja.js' },
            { src: ['dist/ninja.min.js'], dest: 'build/custom/ninja.min.js' },

            { src: ['dist/phaser-arcade-physics.js'], dest: 'build/custom/phaser-arcade-physics.js' },
            { src: ['dist/phaser-arcade-physics.min.js'], dest: 'build/custom/phaser-arcade-physics.min.js' },

            { src: ['dist/phaser-ninja-physics.js'], dest: 'build/custom/phaser-ninja-physics.js' },
            { src: ['dist/phaser-ninja-physics.min.js'], dest: 'build/custom/phaser-ninja-physics.min.js' },

            { src: ['dist/phaser-no-physics.js'], dest: 'build/custom/phaser-no-physics.js' },
            { src: ['dist/phaser-no-physics.min.js'], dest: 'build/custom/phaser-no-physics.min.js' }
        ]
    }
};
