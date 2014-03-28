module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadTasks('./tasks');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/**\n' +
'* @author       Richard Davey <rich@photonstorm.com>\n' +
'* @copyright    2014 Photon Storm Ltd.\n' +
'* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}\n' +
'*\n' +
'* @overview\n' +
'*\n' +
'* Phaser - http://www.phaser.io\n' +
'*\n' +
'* v<%= pkg.version %> "<%= pkg.release %>" - Built: <%= grunt.template.today() %>\n' +
'*\n' +
'* By Richard Davey http://www.photonstorm.com @photonstorm\n' +
'*\n' +
'* Phaser is a fun, free and fast 2D game framework for making HTML5 games \n' +
'* for desktop and mobile web browsers, supporting Canvas and WebGL.\n' +
'*\n' +
'* Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com @Doormat23\n' +
'* Phaser uses p2.js for full-body physics, created by Stefan Hedman https://github.com/schteppe/p2.js @schteppe\n' +
'* Phaser contains a port of N+ Physics, converted by Richard Davey, original by http://www.metanetsoftware.com\n' +
'*\n' +
'* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from which both Phaser\n' +
'* and my love of framework development can be traced.\n' +
'*\n' +
'* Follow development at http://phaser.io and on our forum\n' +
'*\n' +
'* "If you want your children to be intelligent,  read them fairy tales."\n' +
'* "If you want them to be more intelligent, read them more fairy tales."\n' +
'*                                                     -- Albert Einstein\n' +
'*/\n',

        release_dir: 'build',
        compile_dir: 'dist',

        pixi: [
            'src/pixi/Intro.js',
            'src/pixi/Pixi.js',
            'src/pixi/core/Point.js',
            'src/pixi/core/Rectangle.js',
            'src/pixi/core/Polygon.js',
            'src/pixi/core/Circle.js',
            'src/pixi/core/Ellipse.js',
            'src/pixi/core/Matrix.js',
            'src/pixi/display/DisplayObject.js',
            'src/pixi/display/DisplayObjectContainer.js',
            'src/pixi/display/Sprite.js',
            'src/pixi/display/SpriteBatch.js',
            'src/pixi/filters/FilterBlock.js',
            'src/pixi/text/Text.js',
            'src/pixi/text/BitmapText.js',
            'src/pixi/display/Stage.js',
            'src/pixi/utils/Utils.js',
            'src/pixi/utils/EventTarget.js',
            'src/pixi/utils/Polyk.js',
            'src/pixi/renderers/webgl/utils/WebGLShaderUtils.js',
            'src/pixi/renderers/webgl/shaders/PixiShader.js',
            'src/pixi/renderers/webgl/shaders/PixiFastShader.js',
            'src/pixi/renderers/webgl/shaders/StripShader.js',
            'src/pixi/renderers/webgl/shaders/PrimitiveShader.js',
            'src/pixi/renderers/webgl/utils/WebGLGraphics.js',
            'src/pixi/renderers/webgl/WebGLRenderer.js',
            'src/pixi/renderers/webgl/utils/WebGLMaskManager.js',
            'src/pixi/renderers/webgl/utils/WebGLShaderManager.js',
            'src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js',
            'src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js',
            'src/pixi/renderers/webgl/utils/WebGLFilterManager.js',
            'src/pixi/renderers/webgl/utils/FilterTexture.js',
            'src/pixi/renderers/canvas/utils/CanvasMaskManager.js',
            'src/pixi/renderers/canvas/utils/CanvasTinter.js',
            'src/pixi/renderers/canvas/CanvasRenderer.js',
            'src/pixi/renderers/canvas/CanvasGraphics.js',
            'src/pixi/primitives/Graphics.js',
            'src/pixi/extras/TilingSprite.js',
            'src/pixi/textures/BaseTexture.js',
            'src/pixi/textures/Texture.js',
            'src/pixi/textures/RenderTexture.js',
            'src/pixi/Outro.js',
        ],

        phaser: [
            'src/Intro.js',
            'src/Phaser.js',
            'src/utils/Utils.js',

            'src/geom/Circle.js',
            'src/geom/Point.js',
            'src/geom/Rectangle.js',
            'src/geom/Line.js',
            'src/geom/Ellipse.js',
            'src/geom/Polygon.js',

            'src/core/Camera.js',
            'src/core/State.js',
            'src/core/StateManager.js',
            'src/core/LinkedList.js',
            'src/core/Signal.js',
            'src/core/SignalBinding.js',
            'src/core/Filter.js',
            'src/core/Plugin.js',
            'src/core/PluginManager.js',
            'src/core/Stage.js',
            'src/core/Group.js',
            'src/core/World.js',
            'src/core/ScaleManager.js',
            'src/core/Game.js',

            'src/input/Input.js',
            'src/input/Key.js',
            'src/input/Keyboard.js',
            'src/input/Mouse.js',
            'src/input/MSPointer.js',
            'src/input/Pointer.js',
            'src/input/Touch.js',
            'src/input/Gamepad.js',
            'src/input/SinglePad.js',
            'src/input/GamepadButton.js',
            'src/input/InputHandler.js',

            'src/gameobjects/Events.js',
            'src/gameobjects/GameObjectFactory.js',
            'src/gameobjects/GameObjectCreator.js',
            'src/gameobjects/BitmapData.js',
            'src/gameobjects/Sprite.js',
            'src/gameobjects/Image.js',
            'src/gameobjects/TileSprite.js',
            'src/gameobjects/Text.js',
            'src/gameobjects/BitmapText.js',
            'src/gameobjects/Button.js',
            'src/gameobjects/Graphics.js',
            'src/gameobjects/RenderTexture.js',
            'src/gameobjects/SpriteBatch.js',
            'src/gameobjects/RetroFont.js',

            'src/system/Canvas.js',
            'src/system/Device.js',
            'src/system/RequestAnimationFrame.js',

            'src/math/Math.js',
            'src/math/RandomDataGenerator.js',
            'src/math/QuadTree.js',

            'src/net/Net.js',

            'src/tween/TweenManager.js',
            'src/tween/Tween.js',
            'src/tween/Easing.js',

            'src/time/Time.js',
            'src/time/Timer.js',
            'src/time/TimerEvent.js',

            'src/animation/AnimationManager.js',
            'src/animation/Animation.js',
            'src/animation/Frame.js',
            'src/animation/FrameData.js',
            'src/animation/AnimationParser.js',

            'src/loader/Cache.js',
            'src/loader/Loader.js',
            'src/loader/LoaderParser.js',

            'src/sound/Sound.js',
            'src/sound/SoundManager.js',

            'src/utils/Debug.js',
            'src/utils/Color.js',

            'src/physics/Physics.js',

            'src/physics/arcade/World.js',
            'src/physics/arcade/Body.js',

            'src/particles/Particles.js',
            'src/particles/arcade/ArcadeParticles.js',
            'src/particles/arcade/Emitter.js',

            'src/tilemap/Tile.js',
            'src/tilemap/Tilemap.js',
            'src/tilemap/TilemapLayer.js',
            'src/tilemap/TilemapParser.js',
            'src/tilemap/Tileset.js',

            'src/Outro.js'
        ],

        p2: [
            'src/physics/p2/p2.js',
            'src/physics/p2/World.js',
            'src/physics/p2/PointProxy.js',
            'src/physics/p2/InversePointProxy.js',
            'src/physics/p2/Body.js',
            'src/physics/p2/BodyDebug.js',
            'src/physics/p2/Spring.js',
            'src/physics/p2/Material.js',
            'src/physics/p2/ContactMaterial.js',
            'src/physics/p2/CollisionGroup.js',
            'src/physics/p2/DistanceConstraint.js',
            'src/physics/p2/GearConstraint.js',
            'src/physics/p2/LockConstraint.js',
            'src/physics/p2/PrismaticConstraint.js',
            'src/physics/p2/RevoluteConstraint.js'
        ],

        ninja: [
            'src/physics/ninja/World.js',
            'src/physics/ninja/Body.js',
            'src/physics/ninja/AABB.js',
            'src/physics/ninja/Tile.js',
            'src/physics/ninja/Circle.js'
        ],

        //  If we've updated pixi or p2 then their UMD wrappers will be wrong, this will fix it:
        replace: {

            pixi: {
                src: ['src/pixi/Outro.js'],
                dest: 'src/pixi/Outro.js',
                replacements: [{
                    from: "define(PIXI);",
                    to: "define('PIXI', (function() { return root.PIXI = PIXI; })() );"
                }]
            },

            p2: {
                src: ['src/physics/p2/p2.js'],
                dest: 'src/physics/p2/p2.js',
                replacements: [{
                    from: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){',
                    to: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(\'p2\', (function() { return this.p2 = e(); })()):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){'
                }]
            }

        },

        clean: ['<%= compile_dir %>'],

        concat: {

            //  Our custom version of p2
            p2: {
                src: ['<%= p2 %>'],
                dest: '<%= compile_dir %>/p2.js'
            },

            //  Our custom version of Pixi
            pixi: {
                src: ['<%= pixi %>'],
                dest: '<%= compile_dir %>/pixi.js'
            },

            //  Our custom version of Ninja Physics
            ninja: {
                src: ['<%= ninja %>'],
                dest: '<%= compile_dir %>/ninja.js'
            },

            //  Phaser with no bundled libs
            phaser: {
                options: {
                    banner: '<%= banner %>'
                },
                src: ['<%= phaser %>'],
                dest: '<%= compile_dir %>/phaser-no-libs.js'
            },

            //  Phaser with pixi but no physics libs
            phaserNoPhysics: {
                options: {
                    banner: '<%= banner %>'
                },
                src: ['<%= compile_dir %>/pixi.js', '<%= compile_dir %>/phaser-no-libs.js'],
                dest: '<%= compile_dir %>/phaser-no-physics.js'
            },

            //  One ring to rule them all
            standalone: {
                options: {
                    banner: '<%= banner %>'
                },
                src: ['<%= compile_dir %>/pixi.js', '<%= compile_dir %>/phaser-no-libs.js', '<%= compile_dir %>/ninja.js', '<%= compile_dir %>/p2.js'],
                dest: '<%= compile_dir %>/phaser.js'
            }

        },

        uglify: {

            p2: {
                options: {
                    banner: '/* p2.js custom build for Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.p2.dest %>'],
                dest: '<%= compile_dir %>/p2.min.js'
            },

            pixi: {
                options: {
                    banner: '/* Pixi.js custom build for Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.pixi.dest %>'],
                dest: '<%= compile_dir %>/pixi.min.js'
            },

            ninja: {
                options: {
                    banner: '/* Ninja Physics for Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.ninja.dest %>'],
                dest: '<%= compile_dir %>/ninja.min.js'
            },

            phaser: {
                options: {
                    banner: '/* Phaser (no libs) v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.phaser.dest %>'],
                dest: '<%= compile_dir %>/phaser-no-libs.min.js'
            },

            phaserNoPhysics: {
                options: {
                    banner: '/* Phaser (no physics) v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.phaserNoPhysics.dest %>'],
                dest: '<%= compile_dir %>/phaser-no-physics.min.js'
            },

            standalone: {
                options: {
                    sourceMap: true,
                    sourceMapName: '<%= compile_dir %>/phaser.map',
                    banner: '/* Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.standalone.dest %>'],
                dest: '<%= compile_dir %>/phaser.min.js'
            }

        },

        copy: {
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
                    { src: ['dist/phaser-no-physics.js'], dest: 'build/custom/phaser-no-physics.js' },
                    { src: ['dist/phaser-no-physics.min.js'], dest: 'build/custom/phaser-no-physics.min.js' }

                ]
            }
        },

        connect: {
            root: {
                options: {
                    keepalive: true,
                    hostname: '*'
                }
            }
        },

        jshint: {
            src: {
                src: [
                    'plugins/**/*.js',
                    'src/**/*.js',
                    '!src/Intro.js',
                    '!src/Outro.js',
                    '!src/pixi/**/*',
                    '!src/physics/p2/p2.js',
                    '!plugins/AStar.js'
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
        }
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('dist', ['build', 'copy']);

};
