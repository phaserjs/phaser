module.exports = {

    dist: {
        src: [ 
            '<%= docs_dir %>/pixi-jsdoc.js',
            './src/Phaser.js', 
            './src/animation/', 
            './src/core/', 
            './src/gameobjects/', 
            './src/geom/', 
            './src/input/', 
            './src/loader/', 
            './src/math/', 
            './src/net/', 
            './src/particles/', 
            './src/physics/', 
            './src/sound/', 
            './src/system/', 
            './src/tilemap/', 
            './src/time/', 
            './src/tween/', 
            './src/utils/',
            './README.md'
        ],
        options: {
            destination: '<%= docs_dir %>',
            template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
            configure : './tasks/jsdoc-conf.json',
            encoding: 'utf8',
            recurse: true,
            private: false,
            lenient: true
        }
    }

};